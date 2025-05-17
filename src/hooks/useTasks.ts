import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp, Timestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Task } from '../types';

export type TaskStatus = 'active' | 'completed' | 'archived';

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTasksLoading, setAllTasksLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState<TaskStatus>('active');

  // Helper function to safely convert any date format from Firestore to a JavaScript Date
  const convertToDate = (dateValue: any): Date | null => {
    if (!dateValue) return null;

    try {
      // If it's a Firestore Timestamp with toDate method
      if (dateValue && typeof dateValue.toDate === 'function') {
        return dateValue.toDate();
      }

      // If it's already a Date object
      if (dateValue instanceof Date) {
        return dateValue;
      }

      // If it's a string or number, try to convert it
      if (typeof dateValue === 'string' || typeof dateValue === 'number') {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }

      // If we can't convert it, return null
      return null;
    } catch (error) {
      console.error("Error converting date:", error);
      return null;
    }
  };

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

          // Convert dates using our helper function
          const createdAt = convertToDate(data.createdAt);
          const completedAt = convertToDate(data.completedAt);

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

          // Convert dates using our helper function
          const createdAt = convertToDate(data.createdAt);
          const completedAt = convertToDate(data.completedAt);

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

  // Update a task's completion date
  const updateTaskCompletionDate = async (taskId: string, completionDate: Date) => {
    // Get the current task from Firestore directly to ensure we have the latest data
    const taskRef = doc(db, 'tasks', taskId);
    const taskSnapshot = await getDoc(taskRef);

    if (!taskSnapshot.exists()) {
      console.error("Task does not exist:", taskId);
      return;
    }

    const taskData = taskSnapshot.data();
    const userId = taskData.userId;

    // Make sure we preserve the userId when updating
    await updateDoc(taskRef, {
      completedAt: Timestamp.fromDate(completionDate),
      completed: true, // Make sure the task is marked as completed
      userId: userId // Explicitly set the userId again to ensure it's preserved
    });

    // Get the task from our local state
    const task = tasks.find(t => t.id === taskId) || allTasks.find(t => t.id === taskId);

    if (task) {
      // Update local state with JavaScript Date
      const updatedTask = {
        ...task,
        completed: true,
        completedAt: completionDate,
        userId: userId // Ensure userId is set properly in local state too
      };

      setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? updatedTask : t));
      setAllTasks(prevTasks => prevTasks.map(t => t.id === taskId ? updatedTask : t));
    } else {
      // If task isn't in local state, refresh our data
      const user = auth.currentUser;
      if (user) {
        // Force a refresh of the tasks
        const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedTasks: Task[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedTasks.push({
            id: doc.id,
            ...data,
            createdAt: convertToDate(data.createdAt),
            completedAt: convertToDate(data.completedAt)
          } as Task);
        });

        setAllTasks(fetchedTasks);

        // Update filtered tasks based on current filter
        const filteredTasks = fetchedTasks.filter(t => {
          if (taskFilter === 'active') return !t.completed && !t.archived;
          if (taskFilter === 'completed') return t.completed && !t.archived;
          return t.archived;
        });

        setTasks(filteredTasks);
      }
    }
  };

  // Manually fix a task's ownership
  const fixTaskOwnership = async (taskId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const taskRef = doc(db, 'tasks', taskId);

    // Update the task with the current user's ID
    await updateDoc(taskRef, {
      userId: user.uid
    });

    // Refresh tasks to reflect changes
    const user1 = auth.currentUser;
    if (user1) {
      // Force a refresh of all tasks
      const q = query(collection(db, 'tasks'), where('userId', '==', user1.uid));
      const querySnapshot = await getDocs(q);
      const fetchedTasks: Task[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedTasks.push({
          id: doc.id,
          ...data,
          createdAt: convertToDate(data.createdAt),
          completedAt: convertToDate(data.completedAt)
        } as Task);
      });

      setAllTasks(fetchedTasks);

      // Update filtered tasks based on current filter
      const filteredTasks = fetchedTasks.filter(t => {
        if (taskFilter === 'active') return !t.completed && !t.archived;
        if (taskFilter === 'completed') return t.completed && !t.archived;
        return t.archived;
      });

      setTasks(filteredTasks);
    }
  };

  return {
    tasks,
    allTasks,
    loading,
    allTasksLoading,
    addTask,
    completeTask,
    archiveTask,
    updateTaskCompletionDate,
    fixTaskOwnership,
    taskFilter,
    changeTaskFilter
  };
};

export default useTasks;