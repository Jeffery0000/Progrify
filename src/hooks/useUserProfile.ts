import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User } from '../types';
import { calculateLevel } from '../utils/levelSystem';

const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        // Get initial user data
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          // Set up real-time listener for user document
          const unsubscribeSnapshot = onSnapshot(
            doc(db, 'users', user.uid),
            (snapshot) => {
              if (snapshot.exists()) {
                const userData = snapshot.data() as Omit<User, 'level' | 'experienceToNextLevel'>;
                const { level, experienceToNextLevel } = calculateLevel(userData.experience);
                
                setUserProfile({
                  ...userData,
                  level,
                  experienceToNextLevel,
                } as User);
              }
              setLoading(false);
            },
            (err) => {
              setError(err.message);
              setLoading(false);
            }
          );
          
          return () => unsubscribeSnapshot();
        } else {
          // If user doc doesn't exist yet
          setUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            level: 1,
            experience: 0,
            experienceToNextLevel: 100,
          });
          setLoading(false);
        }
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return { userProfile, loading, error };
};

export default useUserProfile;