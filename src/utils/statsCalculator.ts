import { Task, DailyStats } from '../types';

// Get day name from day number (0-6)
const getDayName = (dayNumber: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber];
};

// Safe date conversion helper
const safeGetDate = (dateInput: any): Date | null => {
  if (!dateInput) return null;

  try {
    // Handle Firestore Timestamp objects
    if (typeof dateInput.toDate === 'function') {
      return dateInput.toDate();
    }

    // Handle Date objects
    if (dateInput instanceof Date) {
      return dateInput;
    }

    // Handle string/number timestamps
    return new Date(dateInput);
  } catch (e) {
    console.error("Failed to parse date:", e);
    return null;
  }
};

// Calculate average DAILY TOTAL points by day of week
export const calculateDailyAverages = (tasks: Task[]): DailyStats[] => {
  // Step 1: Group tasks by unique calendar dates and calculate total points per day
  const uniqueDaysMap: { [key: string]: { dayOfWeek: number; totalPoints: number } } = {};

  tasks.forEach(task => {
    if (task.completed && task.completedAt) {
      const completedDate = safeGetDate(task.completedAt);
      if (completedDate && typeof task.points === 'number') {
        const dayOfWeek = completedDate.getDay();
        const dateKey = `${completedDate.getFullYear()}-${completedDate.getMonth()}-${completedDate.getDate()}`;

        if (!uniqueDaysMap[dateKey]) {
          uniqueDaysMap[dateKey] = { dayOfWeek, totalPoints: 0 };
        }

        uniqueDaysMap[dateKey].totalPoints += task.points;
      }
    }
  });

  // Step 2: Group daily totals by day of week
  const pointsByDayOfWeek: { [key: number]: number[] } = {
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
  };

  Object.values(uniqueDaysMap).forEach(({ dayOfWeek, totalPoints }) => {
    pointsByDayOfWeek[dayOfWeek].push(totalPoints);
  });

  // Step 3: Calculate averages for each day of the week
  const dailyStats: DailyStats[] = [];

  for (let i = 0; i < 7; i++) {
    const dayTotals = pointsByDayOfWeek[i];
    const total = dayTotals.reduce((sum, points) => sum + points, 0);
    const average = dayTotals.length > 0 ? total / dayTotals.length : 0;

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

// Get unique days from completed tasks (including archived)
export const getCompletedTaskDays = (tasks: Task[]): number => {
  const uniqueDays = new Set();

  tasks.forEach(task => {
    if (task.completed && task.completedAt) {
      const date = safeGetDate(task.completedAt);
      if (date) {
        uniqueDays.add(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
      }
    }
  });

  return uniqueDays.size;
};

// Calculate total points from completed tasks (including archived)
export const calculateTotalPoints = (tasks: Task[]): number => {
  return tasks.reduce((total, task) => {
    if (task.completed && typeof task.points === 'number') {
      return total + task.points;
    }
    return total;
  }, 0);
};