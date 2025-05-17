import React from 'react';
import { CheckCircle, Circle, Archive, ArchiveRestore } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onComplete?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  isArchived?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onDelete, isArchived = false }) => {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-amber-100 text-amber-800',
    hard: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`
      bg-white rounded-lg shadow-sm p-4 border-l-4 
      ${isArchived ? 'border-gray-300 opacity-75' :
        task.completed ? 'border-gray-300 opacity-75' :
          `border-${task.difficulty === 'easy' ? 'green' : task.difficulty === 'medium' ? 'amber' : 'red'}-500`}
      transition-all duration-200 hover:shadow-md
    `}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-lg font-medium ${task.completed || isArchived ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {task.title}
        </h3>

        <div className="flex items-center space-x-2">
          {onComplete && !isArchived && (
            <button
              onClick={() => onComplete(task)}
              className="text-gray-400 hover:text-teal-600 transition-colors"
              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              {task.completed ? (
                <CheckCircle className="h-6 w-6 text-teal-600" />
              ) : (
                <Circle className="h-6 w-6" />
              )}
            </button>
          )}

          {onDelete && !isArchived && (
            <button
              onClick={() => onDelete(task)}
              className="text-gray-400 hover:text-red-600 transition-colors"
              aria-label="Archive task"
            >
              <Archive className="h-5 w-5" />
            </button>
          )}

          {isArchived && (
            <span className="text-gray-400">
              <ArchiveRestore className="h-5 w-5" />
            </span>
          )}
        </div>
      </div>

      {task.description && (
        <p className={`text-sm mb-3 ${task.completed || isArchived ? 'text-gray-400' : 'text-gray-600'}`}>
          {task.description}
        </p>
      )}

      <div className="flex justify-between items-center">
        <span className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${isArchived ? 'bg-gray-100 text-gray-600' : difficultyColors[task.difficulty]}
        `}>
          {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)} • {task.points} {task.points === 1 ? 'point' : 'points'}
        </span>

        {task.completed && task.completedAt && (
          <span className="text-xs text-gray-500">
            Completed: {new Date(task.completedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;