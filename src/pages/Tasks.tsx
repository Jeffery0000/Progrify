import React, { useState } from 'react';
import { Loader2, Plus, Filter } from 'lucide-react';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import useTasks from '../hooks/useTasks';

type FilterOption = 'all' | 'completed' | 'active' | 'easy' | 'medium' | 'hard';

const Tasks: React.FC = () => {
  const { tasks, loading, addTask, completeTask, deleteTask } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<FilterOption>('all');
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return task.difficulty === filter;
  });
  
  // Sort tasks: active first, then by creation date (newest first)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by completion status
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    
    // Then sort by creation date
    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button
              onClick={() => setFilter(filter === 'all' ? 'active' : 'all')}
              className="flex items-center px-3 py-2 bg-white rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
            >
              <Filter size={16} className="mr-1" />
              <span>
                {filter === 'all' ? 'All Tasks' : 
                 filter === 'active' ? 'Active' :
                 filter === 'completed' ? 'Completed' :
                 filter.charAt(0).toUpperCase() + filter.slice(1)}
              </span>
            </button>
            
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg overflow-hidden z-10 border border-gray-200 hidden group-focus:block">
              <button
                onClick={() => setFilter('all')}
                className={`block w-full text-left px-4 py-2 text-sm ${filter === 'all' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                All Tasks
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`block w-full text-left px-4 py-2 text-sm ${filter === 'active' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`block w-full text-left px-4 py-2 text-sm ${filter === 'completed' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('easy')}
                className={`block w-full text-left px-4 py-2 text-sm ${filter === 'easy' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                Easy
              </button>
              <button
                onClick={() => setFilter('medium')}
                className={`block w-full text-left px-4 py-2 text-sm ${filter === 'medium' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                Medium
              </button>
              <button
                onClick={() => setFilter('hard')}
                className={`block w-full text-left px-4 py-2 text-sm ${filter === 'hard' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                Hard
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center px-3 py-2 rounded-md text-sm ${
              showForm 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            <Plus size={16} className="mr-1" />
            {showForm ? 'Cancel' : 'New Task'}
          </button>
        </div>
      </div>
      
      {showForm && (
        <TaskForm
          onSubmit={(taskData) => {
            addTask(taskData);
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
              onComplete={completeTask}
              onDelete={deleteTask}
            />
          ))
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">No tasks found.</p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                View all tasks
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;