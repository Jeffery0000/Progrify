import { LevelThreshold } from '../types';

// Define experience required for each level
export const levelThresholds: LevelThreshold[] = [
  { level: 1, experienceRequired: 0 },
  { level: 2, experienceRequired: 100 },
  { level: 3, experienceRequired: 250 },
  { level: 4, experienceRequired: 450 },
  { level: 5, experienceRequired: 700 },
  { level: 6, experienceRequired: 1000 },
  { level: 7, experienceRequired: 1350 },
  { level: 8, experienceRequired: 1750 },
  { level: 9, experienceRequired: 2200 },
  { level: 10, experienceRequired: 2700 },
  // Additional levels can be added as needed
];

// Calculate user level based on total XP
export const calculateLevel = (experience: number): { level: number; experienceToNextLevel: number } => {
  let currentLevel = 1;
  let nextLevelThreshold = 100;
  
  for (let i = 0; i < levelThresholds.length; i++) {
    if (experience >= levelThresholds[i].experienceRequired) {
      currentLevel = levelThresholds[i].level;
      nextLevelThreshold = i < levelThresholds.length - 1 
        ? levelThresholds[i + 1].experienceRequired 
        : levelThresholds[i].experienceRequired + 500;
    } else {
      break;
    }
  }
  
  const experienceToNextLevel = nextLevelThreshold - experience;
  
  return { level: currentLevel, experienceToNextLevel };
};

// Calculate XP gained based on task difficulty
export const calculateExperienceGain = (difficulty: 'easy' | 'medium' | 'hard'): number => {
  switch (difficulty) {
    case 'easy':
      return 10;
    case 'medium':
      return 25;
    case 'hard':
      return 50;
    default:
      return 0;
  }
};

// Calculate points based on task difficulty
export const calculatePoints = (difficulty: 'easy' | 'medium' | 'hard'): number => {
  switch (difficulty) {
    case 'easy':
      return 1;
    case 'medium':
      return 2;
    case 'hard':
      return 3;
    default:
      return 0;
  }
};