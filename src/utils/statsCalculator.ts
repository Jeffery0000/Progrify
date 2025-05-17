import { Task, DailyStats } from '../types';

// Get day name from day number (0-6)
const getDayName = (dayNumber: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber];
};

// Calculate average points per day of week
export const calculateDailyAverages = (tasks: Task[]): DailyStats[] => {
  // Initialize counters for each day of the week
  const pointsPerDay: { [key: number]: number[] } = {
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
  };
  
  // Group completed tasks by day of week
  tasks.forEach(task => {
    if (task.completed && task.completedAt) {
      const completedDate = task.completedAt instanceof Date 
        ? task.completedAt 
        : new Date(task.completedAt);
      const dayOfWeek = completedDate.getDay();
      pointsPerDay[dayOfWeek].push(task.points);
    }
  });
  
  // Calculate averages
  const dailyStats: DailyStats[] = [];
  
  for (let i = 0; i < 7; i++) {
    const dayPoints = pointsPerDay[i];
    const total = dayPoints.reduce((sum, points) => sum + points, 0);
    const average = dayPoints.length > 0 ? total / dayPoints.length : 0;
    
    dailyStats.push({
      dayOfWeek: i,
      dayName: getDayName(i),
      averagePoints: Number(average.toFixed(1))
    });
  }
  
  // Sort by day of week, starting with Monday (1) through Sunday (0)
  dailyStats.sort((a, b) => {
    // Convert Sunday (0) to 7 for sorting purposes
    const adjustedDayA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
    const adjustedDayB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
    return adjustedDayA - adjustedDayB;
  });
  
  return dailyStats;
};

// Calculate total points earned today
export const calculateTodayPoints = (tasks: Task[]): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return tasks.reduce((total, task) => {
    if (task.completed && task.completedAt) {
      const completedDate = task.completedAt instanceof Date 
        ? task.completedAt 
        : new Date(task.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      
      if (completedDate.getTime() === today.getTime()) {
        return total + task.points;
      }
    }
    return total;
  }, 0);
};