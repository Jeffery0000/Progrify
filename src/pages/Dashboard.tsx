import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import QuoteBox from '../components/QuoteBox';
import PetDisplay from '../components/PetDisplay';
import { Loader2 } from 'lucide-react';
import useUserProfile from '../hooks/useUserProfile';
import useTasks from '../hooks/useTasks';
import { calculatePoints } from '../utils/levelSystem';
import LevelUpModal from '../components/LevelUpModal';

const Dashboard: React.FC = () => {
  const {
    userProfile,
    loading: profileLoading,
    updateExperience,
    leveledUp,
    newLevel,
    clearLevelUp
  } = useUserProfile();

  const {
    tasks,
    loading: tasksLoading,
    addTask,
    completeTask,
    archiveTask
  } = useTasks();

  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [petAnimation, setPetAnimation] = useState<'idle' | 'easy' | 'medium' | 'hard'>('idle');

  useEffect(() => {
    if (tasks.length > 0) {
      // Get 5 most recent active tasks
      const sorted = [...tasks]
        .filter(task => !task.completed) // Only show active tasks in Recent Tasks
        .sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

      setRecentTasks(sorted.slice(0, 5));
    } else {
      // Clear recent tasks when there are no tasks
      setRecentTasks([]);
    }
  }, [tasks]);

  // Wrapper for completeTask that uses the updateExperience function
  // Now also triggers pet animation based on task difficulty
  const handleCompleteTask = async (task: Task) => {
    if (!task?.id) return;

    console.log(`Task completed - difficulty: ${task.difficulty}`);

    // Force animation to be idle first (to ensure it can be triggered again)
    setPetAnimation('idle');

    // Small delay before triggering the animation to ensure it's applied correctly
    setTimeout(() => {
      setPetAnimation(task.difficulty);

      // Reset animation after completion
      setTimeout(() => {
        setPetAnimation('idle');
      }, 2000);
    }, 50);

    await completeTask(task.id, updateExperience);
  };

  // Wrapper for archiveTask to match TaskCard's expected parameter type
  const handleArchiveTask = async (task: Task) => {
    if (!task?.id) return;
    await archiveTask(task.id);
  };

  // Wrapper for addTask to match TaskForm's expected format and add points
  const handleAddTask = (taskData: {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }) => {
    // Calculate points based on difficulty and add to task data
    const points = calculatePoints(taskData.difficulty);
    return addTask({
      ...taskData,
      points
    });
  };

  const loading = profileLoading || tasksLoading;

  return (
    <div className="space-y-6">
      {/* Level up modal */}
      {leveledUp && (
        <LevelUpModal newLevel={newLevel} onClose={clearLevelUp} />
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

          {/* Welcome card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-2">
              Welcome{userProfile?.displayName ? `, ${userProfile.displayName}` : ''}!
            </h2>
            <p className="text-gray-600 mb-4">
              Track your productivity and level up your life. Start by adding tasks below.
            </p>

            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                  <p className="text-sm text-teal-700 mb-1">Total points earned</p>
                  <p className="text-2xl font-bold text-teal-800">{userProfile?.totalPointsEarned || 0}</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <p className="text-sm text-purple-700 mb-1">Current level</p>
                  <p className="text-2xl font-bold text-purple-800">{userProfile?.level || 1}</p>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <p className="text-sm text-amber-700 mb-1">Tasks completed</p>
                  <p className="text-2xl font-bold text-amber-800">
                    {userProfile?.totalTasksCompleted || 0}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* New task form */}
          <TaskForm onSubmit={handleAddTask} />

          {/* Recent tasks */}
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-3">Recent Tasks</h2>
            {tasksLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 text-teal-500 animate-spin" />
              </div>
            ) : recentTasks.length > 0 ? (
              <div className="space-y-3">
                {recentTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleCompleteTask}
                    onDelete={handleArchiveTask}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">No tasks added yet. Add your first task above!</p>
              </div>
            )}
          </div>
        </div>

        <div className="md:w-1/3 space-y-6">
          {/* Quote of the day */}
          <QuoteBox />

          {/* Pet display - replacing the "Coming Soon" section */}
          <PetDisplay
            level={userProfile?.level || 1}
            animationTrigger={petAnimation}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;