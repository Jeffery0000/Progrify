import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { calculateExperienceGain, calculateLevel } from '../utils/levelSystem';
import { Task } from '../types';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalTasksCompleted: number;
  totalPointsEarned: number;
}

const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  useEffect(() => {
    let unsubscribeAuth: () => void;
    let unsubscribeDoc: () => void;

    unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);

        // First fetch to initialize data
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // Create initial user profile
          const initialProfile: UserProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            level: 1,
            experience: 0,
            experienceToNextLevel: 100,
            totalTasksCompleted: 0,
            totalPointsEarned: 0
          };

          await setDoc(userDocRef, initialProfile);
          setUserProfile(initialProfile);

          // Also create initial leaderboard entry
          await setDoc(doc(db, 'leaderboard', user.uid), {
            uid: user.uid,
            displayName: user.displayName || 'Anonymous User',
            email: user.email,
            level: 1,
            totalPointsEarned: 0,
            totalTasksCompleted: 0
          });
        }

        // Set up real-time listener for profile updates
        unsubscribeDoc = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data() as UserProfile;
            setUserProfile({
              ...data,
              totalPointsEarned: data.totalPointsEarned || 0
            });
          }
          setLoading(false);
        });
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const updateExperience = async (task: Task) => {
    if (!userProfile) return;

    // Calculate experience gain based on task difficulty
    const experienceGain = calculateExperienceGain(task.difficulty);

    // Add experience to current total
    const newExperience = userProfile.experience + experienceGain;

    // Calculate new level based on total experience
    const { level: newLevel, experienceToNextLevel } = calculateLevel(newExperience);

    // Check if user leveled up
    const didLevelUp = newLevel > userProfile.level;

    // Update total points earned
    const newTotalPoints = userProfile.totalPointsEarned + task.points;

    // Create updated profile data
    const updatedProfile = {
      ...userProfile,
      experience: newExperience,
      level: newLevel,
      experienceToNextLevel: experienceToNextLevel,
      totalTasksCompleted: (userProfile.totalTasksCompleted || 0) + 1,
      totalPointsEarned: newTotalPoints
    };

    // Update Firestore
    const userDocRef = doc(db, 'users', userProfile.uid);
    await updateDoc(userDocRef, {
      experience: newExperience,
      level: newLevel,
      experienceToNextLevel: experienceToNextLevel,
      totalTasksCompleted: updatedProfile.totalTasksCompleted,
      totalPointsEarned: newTotalPoints
    });

    // Update leaderboard entry
    const leaderboardRef = doc(db, 'leaderboard', userProfile.uid);
    await setDoc(leaderboardRef, {
      uid: userProfile.uid,
      displayName: userProfile.displayName || 'Anonymous User',
      email: userProfile.email,
      level: newLevel,
      totalPointsEarned: newTotalPoints,
      totalTasksCompleted: updatedProfile.totalTasksCompleted
    }, { merge: true });

    // If the user leveled up, set state for potential UI feedback
    if (didLevelUp) {
      setLeveledUp(true);
      setNewLevel(newLevel);
    }

    return didLevelUp;
  };

  // Clear the level up state (for after displaying level up notification)
  const clearLevelUp = () => {
    setLeveledUp(false);
  };

  // Legacy function for backward compatibility
  const incrementCompletedTasks = async () => {
    if (!userProfile) return;

    const userDocRef = doc(db, 'users', userProfile.uid);

    // Increment the counter in Firestore
    await updateDoc(userDocRef, {
      totalTasksCompleted: (userProfile.totalTasksCompleted || 0) + 1
    });

    // Also update the leaderboard
    const leaderboardRef = doc(db, 'leaderboard', userProfile.uid);
    await setDoc(leaderboardRef, {
      uid: userProfile.uid,
      displayName: userProfile.displayName || 'Anonymous User',
      email: userProfile.email,
      level: userProfile.level,
      totalPointsEarned: userProfile.totalPointsEarned || 0,
      totalTasksCompleted: (userProfile.totalTasksCompleted || 0) + 1
    }, { merge: true });
  };

  return {
    userProfile,
    loading,
    incrementCompletedTasks,
    updateExperience,
    leveledUp,
    newLevel,
    clearLevelUp
  };
};

export default useUserProfile;