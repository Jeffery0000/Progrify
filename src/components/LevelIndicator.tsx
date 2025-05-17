import React, { useEffect, useState } from 'react';

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
  // Store the progress percentage in state to animate it
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    // Find the current level threshold from levelThresholds
    let currentLevelThreshold = 0;

    // This is a simplified version - in production you'd import the actual thresholds
    const thresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700];

    for (let i = 0; i < thresholds.length; i++) {
      if (level > i && i < thresholds.length) {
        currentLevelThreshold = thresholds[i];
      }
    }

    // Calculate experience gained in current level
    const experienceInCurrentLevel = experience - currentLevelThreshold;

    // Calculate total XP needed for this level
    const totalXpNeededForLevel = experienceInCurrentLevel + experienceToNextLevel;

    // Calculate progress percentage
    const newProgress = Math.min(
      Math.round((experienceInCurrentLevel / totalXpNeededForLevel) * 100),
      100
    );

    // Animate the progress bar by updating it after component mounts
    setProgressPercentage(newProgress);
  }, [experience, experienceToNextLevel, level]);

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