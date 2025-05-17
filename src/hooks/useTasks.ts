import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Task } from '../types';

export type TaskStatus = 'active' | 'completed' | 'archived';

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTasksLoading, setAllTasksLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState<TaskStatus>('active');

  // Fetch tasks based on the current filter
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const user = auth.currentUser;

      if (user) {
        let q;

        if (taskFilter === 'active') {
          q = query(
            collection(db, 'tasks'),
            where('userId', '==', user.uid),
            where('completed', '==', false),
            where('archived', '==', false)
          );
        } else if (taskFilter === 'completed') {
          q = query(
            collection(db, 'tasks'),
            where('userId', '==', user.uid),
            where('completed', '==', true),
            where('archived', '==', false)
          );
        } else {
          q = query(
            collection(db, 'tasks'),
            where('userId', '==', user.uid),
            where('archived', '==', true)
          );
        }

        const querySnapshot = await getDocs(q);
        const fetchedTasks: Task[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          // Convert Firestore timestamps to JavaScript Date objects
          const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt;
          const completedAt = data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt;

          fetchedTasks.push({
            id: doc.id,
            ...data,
            createdAt,
            completedAt
          } as Task);
        });

        setTasks(fetchedTasks);
      }

      setLoading(false);
    };

    fetchTasks();
  }, [taskFilter]);

  // Fetch ALL tasks for statistics (regardless of status)
  useEffect(() => {
    const fetchAllTasks = async () => {
      setAllTasksLoading(true);
      const user = auth.currentUser;

      if (user) {
        // Get all tasks for the current user
        const q = query(
          collection(db, 'tasks'),
          where('userId', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);
        const fetchedTasks: Task[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          // Convert Firestore timestamps to JavaScript Date objects
          const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt;
          const completedAt = data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt;

          fetchedTasks.push({
            id: doc.id,
            ...data,
            createdAt,
            completedAt
          } as Task);
        });

        setAllTasks(fetchedTasks);
      }

      setAllTasksLoading(false);
    };

    fetchAllTasks();
  }, []);

  // Change task filter
  const changeTaskFilter = (filter: TaskStatus) => {
    setTaskFilter(filter);
  };

  // Add a new task
  const addTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completed' | 'archived' | 'completedAt'>) => {
    const user = auth.currentUser;

    if (!user) return;

    const newTask = {
      ...taskData,
      userId: user.uid,
      completed: false,
      archived: false,
      createdAt: serverTimestamp(),
      completedAt: null
    };

    const docRef = await addDoc(collection(db, 'tasks'), newTask);

    // Use current date for UI display until server timestamp is available
    const clientDate = new Date();
    const taskWithId: Task = {
      id: docRef.id,
      ...newTask,
      createdAt: clientDate
    };

    setTasks(prevTasks => [...prevTasks, taskWithId]);
    setAllTasks(prevTasks => [...prevTasks, taskWithId]);

    return taskWithId;
  };

  // Mark a task as complete
  const completeTask = async (taskId: string, updateExperience?: (task: Task) => Promise<boolean | void>) => {
    // First find the task
    const task = tasks.find(t => t.id === taskId) || allTasks.find(t => t.id === taskId);
    if (!task) return;

    const taskRef = doc(db, 'tasks', taskId);
    const now = new Date();

    // Use Firestore timestamp for the database
    await updateDoc(taskRef, {
      completed: true,
      completedAt: Timestamp.fromDate(now)
    });

    // Use JavaScript Date for the local state
    const updatedTask = { ...task, completed: true, completedAt: now };

    // Update both task lists
    setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? updatedTask : t));
    setAllTasks(prevTasks => prevTasks.map(t => t.id === taskId ? updatedTask : t));

    // Update experience if the function is provided
    if (updateExperience) {
      await updateExperience(updatedTask);
    }
  };

  // Archive a task
  const archiveTask = async (taskId: string) => {
    const taskRef = doc(db, 'tasks', taskId);

    await updateDoc(taskRef, {
      archived: true
    });

    // Update both task lists
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setAllTasks(prevTasks => prevTasks.map(task =>
      task.id === taskId ? { ...task, archived: true } : task
    ));
  };

  return {
    tasks,
    allTasks,
    loading,
    allTasksLoading,
    addTask,
    completeTask,
    archiveTask,
    taskFilter,
    changeTaskFilter
  };
};

export default useTasks;