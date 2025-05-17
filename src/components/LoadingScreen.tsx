import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-t-teal-600 border-b-purple-600 border-l-amber-500 border-r-teal-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-white"></div>
          </div>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading...</h2>
      </div>
    </div>
  );
};

export default LoadingScreen;