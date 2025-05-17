import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc,
  deleteDoc, 
  doc,
  serverTimestamp,
  Timestamp,
  increment,
  getDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Task } from '../types';
import { calculatePoints, calculateExperienceGain } from '../utils/levelSystem';
import { calculateLevel } from '../utils/levelSystem';

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  
  // Add a new task
  const addTask = async (taskData: {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const points = calculatePoints(taskData.difficulty);
      
      await addDoc(collection(db, 'tasks'), {
        title: taskData.title,
        description: taskData.description,
        difficulty: taskData.difficulty,
        points,
        completed: false,
        createdAt: serverTimestamp(),
        completedAt: null,
        userId: user.uid
      });
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  // Mark a task as complete/incomplete and update user experience
  const completeTask = async (task: Task) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const taskRef = doc(db, 'tasks', task.id);
      const userRef = doc(db, 'users', user.uid);
      
      // If task is being marked as complete, add experience points
      if (!task.completed) {
        const expGain = calculateExperienceGain(task.difficulty);
        
        // Get current user data to calculate if leveling up
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const currentExp = userData.experience || 0;
          const newExp = currentExp + expGain;
          
          const currentLevel = calculateLevel(currentExp).level;
          const newLevelData = calculateLevel(newExp);
          
          // Check if user leveled up
          if (newLevelData.level > currentLevel) {
            setNewLevel(newLevelData.level);
            setShowLevelUp(true);
          }
          
          // Update user experience
          await updateDoc(userRef, {
            experience: increment(expGain)
          });
        }
        
        // Update task as completed
        await updateDoc(taskRef, {
          completed: true,
          completedAt: serverTimestamp()
        });
      } else {
        // If task is being marked as incomplete, remove experience points
        const expGain = calculateExperienceGain(task.difficulty);
        
        // Update user experience (decrease)
        await updateDoc(userRef, {
          experience: increment(-expGain)
        });
        
        // Update task as incomplete
        await updateDoc(taskRef, {
          completed: false,
          completedAt: null
        });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  // Delete a task
  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  // Load tasks for the current user
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setTasks([]);
        setLoading(false);
        return;
      }
      
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const tasksList: Task[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Convert Firestore Timestamp to JS Date
            const createdAt = data.createdAt instanceof Timestamp 
              ? data.createdAt.toDate() 
              : data.createdAt;
              
            const completedAt = data.completedAt instanceof Timestamp 
              ? data.completedAt.toDate() 
              : data.completedAt;
            
            tasksList.push({
              id: doc.id,
              title: data.title,
              description: data.description,
              difficulty: data.difficulty,
              points: data.points,
              completed: data.completed,
              createdAt,
              completedAt,
              userId: data.userId
            });
          });
          
          setTasks(tasksList);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
      
      return () => unsubscribe();
    });
    
    return () => unsubscribeAuth();
  }, []);
  
  // Reset level up state
  const closeLevelUpModal = () => {
    setShowLevelUp(false);
  };
  
  return { 
    tasks, 
    loading, 
    error, 
    addTask, 
    completeTask, 
    deleteTask,
    showLevelUp,
    newLevel,
    closeLevelUpModal
  };
};

export default useTasks;