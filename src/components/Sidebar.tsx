import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Layout, ListTodo, BarChart2, Trophy, Menu, X } from 'lucide-react'; // Added Trophy icon

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-teal-700 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 bg-teal-800 text-white">
            <h2 className="text-xl font-bold">Productivity Pulse</h2>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-md text-white
                ${isActive ? 'bg-teal-800' : 'hover:bg-teal-600'}
              `}
            >
              <Layout className="mr-3" size={20} />
              Dashboard
            </NavLink>

            <NavLink
              to="/tasks"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-md text-white
                ${isActive ? 'bg-teal-800' : 'hover:bg-teal-600'}
              `}
            >
              <ListTodo className="mr-3" size={20} />
              Tasks
            </NavLink>

            <NavLink
              to="/stats"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-md text-white
                ${isActive ? 'bg-teal-800' : 'hover:bg-teal-600'}
              `}
            >
              <BarChart2 className="mr-3" size={20} />
              Statistics
            </NavLink>

            {/* New Leaderboard Link */}
            <NavLink
              to="/leaderboard"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-md text-white
                ${isActive ? 'bg-teal-800' : 'hover:bg-teal-600'}
              `}
            >
              <Trophy className="mr-3" size={20} />
              Leaderboard
            </NavLink>
          </nav>

          <div className="p-4 text-xs text-teal-100/70">
            <p>© 2025 Progrify</p>
            <p className="mt-1">Your personal growth journey</p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-0 bg-black/30 transition-opacity"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;