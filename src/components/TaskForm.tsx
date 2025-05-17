import React, { useState } from 'react';
import { calculatePoints } from '../utils/levelSystem';

interface TaskFormProps {
  onSubmit: (task: {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      difficulty
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setDifficulty('medium');
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value && !isExpanded) {
                setIsExpanded(true);
              }
            }}
            placeholder="What do you need to accomplish?"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>
        
        {isExpanded && (
          <>
            <div className="mb-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details (optional)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Difficulty
              </label>
              <div className="flex gap-3">
                {(['easy', 'medium', 'hard'] as const).map((option) => (
                  <label
                    key={option}
                    className={`
                      flex-1 cursor-pointer rounded-lg border p-3 flex flex-col items-center transition-colors
                      ${difficulty === option ? 
                        option === 'easy' ? 'bg-green-50 border-green-500' : 
                        option === 'medium' ? 'bg-amber-50 border-amber-500' : 
                        'bg-red-50 border-red-500'
                        : 'border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      name="difficulty"
                      value={option}
                      checked={difficulty === option}
                      onChange={() => setDifficulty(option)}
                    />
                    <span className={`
                      text-sm font-medium
                      ${difficulty === option ? 
                        option === 'easy' ? 'text-green-700' : 
                        option === 'medium' ? 'text-amber-700' : 
                        'text-red-700'
                        : 'text-gray-700'}
                    `}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </span>
                    <span className={`
                      text-xs mt-1
                      ${difficulty === option ? 
                        option === 'easy' ? 'text-green-600' : 
                        option === 'medium' ? 'text-amber-600' : 
                        'text-red-600'
                        : 'text-gray-500'}
                    `}>
                      {calculatePoints(option)} {calculatePoints(option) === 1 ? 'point' : 'points'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
        
        <div className="flex justify-end">
          {isExpanded && (
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
            disabled={!title.trim()}
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;