import React, { useState } from 'react';
import { Loader2, Plus, Filter, Archive } from 'lucide-react';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import useTasks, { TaskStatus } from '../hooks/useTasks';
import { Task } from '../types';
import useUserProfile from '../hooks/useUserProfile';
import { calculatePoints } from '../utils/levelSystem';
import LevelUpModal from '../components/LevelUpModal'; // Import the LevelUpModal component

type FilterOption = 'all' | 'completed' | 'active' | 'easy' | 'medium' | 'hard';

// Safe timestamp conversion helper
const getTimestamp = (date: any): number => {
  if (!date) return 0;

  try {
    // For Firestore Timestamp objects
    if (typeof date.toDate === 'function') {
      return date.toDate().getTime();
    }

    // For Date objects
    if (date instanceof Date) {
      return date.getTime();
    }

    // For string/number timestamps
    return new Date(date).getTime();
  } catch (e) {
    return 0; // Return 0 for any errors
  }
};

const Tasks: React.FC = () => {
  const {
    tasks,
    loading,
    addTask,
    completeTask,
    archiveTask,
    taskFilter,
    changeTaskFilter
  } = useTasks();

  // Get experience updating function from userProfile hook
  const { updateExperience, leveledUp, newLevel, clearLevelUp } = useUserProfile();

  const [showForm, setShowForm] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<FilterOption>('all');

  const filteredTasks = tasks.filter(task => {
    if (difficultyFilter === 'all') return true;
    if (difficultyFilter === 'completed') return task.completed;
    if (difficultyFilter === 'active') return !task.completed;
    return task.difficulty === difficultyFilter;
  });

  // Sort tasks based on the current view with simplified timestamp handling
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Get timestamps safely
    const timeA = getTimestamp(a.createdAt);
    const timeB = getTimestamp(b.createdAt);

    // For archived view, sort by archive date (most recent first)
    if (taskFilter === 'archived') {
      return timeB - timeA;
    }

    // For active view, sort active tasks first, then by creation date
    if (taskFilter === 'active' || taskFilter === 'completed') {
      // If in active view, all tasks are active; if in completed view, all are completed
      // So we just sort by date
      return timeB - timeA;
    }

    // Default sorting
    // First sort by completion status
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;

    // Then sort by creation date
    return timeB - timeA;
  });

  // Wrapper functions to match TaskCard expected props
  const handleCompleteTask = (task: Task) => {
    if (!task.id) return;
    // Pass the updateExperience function to update exp when completing tasks
    completeTask(task.id, updateExperience);
  };

  const handleArchiveTask = (task: Task) => {
    if (!task.id) return;
    archiveTask(task.id);
  };

  return (
    <div className="space-y-6">
      {/* Level up modal */}
      {leveledUp && (
        <LevelUpModal newLevel={newLevel} onClose={clearLevelUp} />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>

        <div className="flex flex-wrap gap-2">
          {/* Task Status Filter */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => changeTaskFilter('active')}
              className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${taskFilter === 'active'
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
            >
              Active
            </button>
            <button
              onClick={() => changeTaskFilter('completed')}
              className={`px-4 py-2 text-sm font-medium border-t border-b ${taskFilter === 'completed'
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
            >
              Completed
            </button>
            <button
              onClick={() => changeTaskFilter('archived')}
              className={`px-4 py-2 text-sm font-medium border rounded-r-lg ${taskFilter === 'archived'
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
            >
              Archived
            </button>
          </div>

          {/* Difficulty Filter Button */}
          <div className="relative">
            <button
              onClick={() => setDifficultyFilter(difficultyFilter === 'all' ? 'active' : 'all')}
              className="flex items-center px-3 py-2 bg-white rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
            >
              <Filter size={16} className="mr-1" />
              <span>
                {difficultyFilter === 'all' ? 'All Tasks' :
                  difficultyFilter === 'active' ? 'Active' :
                    difficultyFilter === 'completed' ? 'Completed' :
                      difficultyFilter.charAt(0).toUpperCase() + difficultyFilter.slice(1)}
              </span>
            </button>

            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg overflow-hidden z-10 border border-gray-200 hidden group-focus:block">
              <button
                onClick={() => setDifficultyFilter('all')}
                className={`block w-full text-left px-4 py-2 text-sm ${difficultyFilter === 'all' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                All Tasks
              </button>
              <button
                onClick={() => setDifficultyFilter('easy')}
                className={`block w-full text-left px-4 py-2 text-sm ${difficultyFilter === 'easy' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                Easy
              </button>
              <button
                onClick={() => setDifficultyFilter('medium')}
                className={`block w-full text-left px-4 py-2 text-sm ${difficultyFilter === 'medium' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                Medium
              </button>
              <button
                onClick={() => setDifficultyFilter('hard')}
                className={`block w-full text-left px-4 py-2 text-sm ${difficultyFilter === 'hard' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                Hard
              </button>
            </div>
          </div>

          {/* New Task Button - only show in active view */}
          {taskFilter === 'active' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center px-3 py-2 rounded-md text-sm ${showForm
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
            >
              <Plus size={16} className="mr-1" />
              {showForm ? 'Cancel' : 'New Task'}
            </button>
          )}
        </div>
      </div>

      {showForm && taskFilter === 'active' && (
        <TaskForm
          onSubmit={(taskData) => {
            const points = calculatePoints(taskData.difficulty);
            addTask({
              ...taskData,
              points
            });
            setShowForm(false);
          }}
        />
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
          </div>
        ) : sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={taskFilter !== 'archived' ? handleCompleteTask : undefined}
              onDelete={taskFilter !== 'archived' ? handleArchiveTask : undefined}
              isArchived={taskFilter === 'archived'}
            />
          ))
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">
              {taskFilter === 'active' && 'No active tasks found.'}
              {taskFilter === 'completed' && 'No completed tasks found.'}
              {taskFilter === 'archived' && 'No archived tasks found.'}
            </p>
            {difficultyFilter !== 'all' && (
              <button
                onClick={() => setDifficultyFilter('all')}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;