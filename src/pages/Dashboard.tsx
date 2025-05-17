import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Task } from '../types';
import { calculateTodayPoints } from '../utils/statsCalculator';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import QuoteBox from '../components/QuoteBox';
import { Loader2 } from 'lucide-react';
import useUserProfile from '../hooks/useUserProfile';
import useTasks from '../hooks/useTasks';

const Dashboard: React.FC = () => {
  const { userProfile, loading: profileLoading } = useUserProfile();
  const { 
    tasks, 
    loading: tasksLoading, 
    addTask, 
    completeTask, 
    deleteTask 
  } = useTasks();
  
  const [todayPoints, setTodayPoints] = useState(0);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (tasks.length > 0) {
      setTodayPoints(calculateTodayPoints(tasks));
      
      // Get 5 most recent tasks
      const sorted = [...tasks].sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      setRecentTasks(sorted.slice(0, 5));
    }
  }, [tasks]);

  const loading = profileLoading || tasksLoading;

  return (
    <div className="space-y-6">
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
                  <p className="text-sm text-teal-700 mb-1">Today's points</p>
                  <p className="text-2xl font-bold text-teal-800">{todayPoints}</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <p className="text-sm text-purple-700 mb-1">Current level</p>
                  <p className="text-2xl font-bold text-purple-800">{userProfile?.level || 1}</p>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <p className="text-sm text-amber-700 mb-1">Tasks completed</p>
                  <p className="text-2xl font-bold text-amber-800">
                    {tasks.filter(task => task.completed).length}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* New task form */}
          <TaskForm onSubmit={addTask} />
          
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
                    onComplete={completeTask}
                    onDelete={deleteTask}
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
          
          {/* Upcoming features teaser */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Coming Soon</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                Task categories and tags
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                Weekly productivity reports
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                Advanced statistics and insights
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                Productivity streaks and rewards
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;