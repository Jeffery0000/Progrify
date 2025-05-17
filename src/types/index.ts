export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalTasksCompleted: number;
  totalPointsEarned: number; // New field to track total points
}

export interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  completed: boolean;
  createdAt: Date | any; // to handle Firebase Timestamp
  completedAt: Date | any | null; // to handle Firebase Timestamp
  userId: string;
  archived: boolean;
}

export interface DailyStats {
  dayOfWeek: number; // 0-6, Sunday to Saturday
  dayName: string;
  averagePoints: number;
}

export interface LevelThreshold {
  level: number;
  experienceRequired: number;
}