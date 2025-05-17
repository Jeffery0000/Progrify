import React from 'react';

interface LevelIndicatorProps {
  level: number;
  experience: number;
  experienceToNextLevel: number;
}

const LevelIndicator: React.FC<LevelIndicatorProps> = ({ 
  level, 
  experience, 
  experienceToNextLevel 
}) => {
  // Calculate total XP needed for the next level
  const totalXpForLevel = experienceToNextLevel + experience;
  
  // Calculate current progress percentage
  const progressPercentage = Math.min(
    Math.round((experience / totalXpForLevel) * 100),
    100
  );

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold">
        {level}
      </div>
      
      <div className="flex flex-col w-48">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-medium">Level {level}</span>
          <span className="text-gray-500">{experienceToNextLevel}XP to level {level + 1}</span>
        </div>
        
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LevelIndicator;