import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ProductivityGraph from '../components/ProductivityGraph';
import { DailyStats, Task } from '../types';
import { calculateDailyAverages } from '../utils/statsCalculator';
import useTasks from '../hooks/useTasks';

const Stats: React.FC = () => {
  const { tasks, loading } = useTasks();
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [averagePointsPerDay, setAveragePointsPerDay] = useState(0);
  const [mostProductiveDay, setMostProductiveDay] = useState('');

  useEffect(() => {
    if (tasks.length > 0) {
      // Calculate daily statistics
      const stats = calculateDailyAverages(tasks);
      setDailyStats(stats);
      
      // Find most productive day
      const maxPoints = Math.max(...stats.map(day => day.averagePoints));
      const mostProductive = stats.find(day => day.averagePoints === maxPoints);
      setMostProductiveDay(mostProductive?.dayName || '');
      
      // Calculate total completed tasks
      const completed = tasks.filter(task => task.completed).length;
      setTotalCompleted(completed);
      
      // Calculate average points per day
      const totalPoints = tasks.reduce((sum, task) => {
        return task.completed ? sum + task.points : sum;
      }, 0);
      
      const uniqueDays = new Set(
        tasks
          .filter(task => task.completed && task.completedAt)
          .map(task => {
            const date = new Date(task.completedAt!);
            return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          })
      ).size;
      
      setAveragePointsPerDay(uniqueDays > 0 ? +(totalPoints / uniqueDays).toFixed(1) : 0);
    }
  }, [tasks]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Statistics</h1>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
        </div>
      ) : tasks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Tasks Completed</h3>
              <p className="text-3xl font-bold text-gray-800">{totalCompleted}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Average Points/Day</h3>
              <p className="text-3xl font-bold text-gray-800">{averagePointsPerDay}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Most Productive Day</h3>
              <p className="text-3xl font-bold text-gray-800">{mostProductiveDay || 'N/A'}</p>
            </div>
          </div>
          
          <ProductivityGraph data={dailyStats} />
          
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Task Breakdown</h2>
            
            <div className="space-y-4">
              {['easy', 'medium', 'hard'].map((difficulty) => {
                const difficultyTasks = tasks.filter(
                  task => task.difficulty === difficulty
                );
                const completedCount = difficultyTasks.filter(
                  task => task.completed
                ).length;
                const percentage = difficultyTasks.length > 0
                  ? Math.round((completedCount / difficultyTasks.length) * 100)
                  : 0;
                
                return (
                  <div key={difficulty}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {difficulty} Tasks
                      </span>
                      <span className="text-sm text-gray-500">
                        {completedCount}/{difficultyTasks.length} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          difficulty === 'easy' ? 'bg-green-500' :
                          difficulty === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">
            No task data available yet. Start by adding and completing tasks!
          </p>
        </div>
      )}
    </div>
  );
};

export default Stats;