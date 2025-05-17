import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Layout, 
  ListTodo, 
  BarChart2, 
  Menu, 
  X 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-teal-600 text-white"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-teal-700 transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:relative md:translate-x-0'}
      `}>
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
          </nav>
          
          <div className="p-4 text-xs text-teal-100/70">
            <p>© 2025 Productivity Pulse</p>
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