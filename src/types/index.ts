export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  level: number;
  experience: number;
  experienceToNextLevel: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  completed: boolean;
  createdAt: Date;
  completedAt: Date | null;
  userId: string;
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