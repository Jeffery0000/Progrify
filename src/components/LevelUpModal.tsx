import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { Award } from 'lucide-react';

interface LevelUpModalProps {
  newLevel: number;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ newLevel, onClose }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Automatically close after 6 seconds
    const timeout = setTimeout(() => {
      onClose();
    }, 6000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={300}
        gravity={0.1}
        colors={['#0D9488', '#7C3AED', '#F59E0B', '#3B82F6', '#EC4899']}
      />
      
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 border-2 border-purple-500 relative z-10 animate-bounce-once">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Award size={32} className="text-purple-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Level Up!</h2>
          <div className="mb-4">
            <span className="text-4xl font-extrabold text-purple-600">{newLevel}</span>
          </div>
          <p className="text-gray-600 mb-6">
            Congratulations! You've reached a new level. Keep up the great work!
          </p>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Continue
          </button>
        </div>
      </div>
      
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-0"
        onClick={onClose}
      />
    </div>
  );
};

export default LevelUpModal;