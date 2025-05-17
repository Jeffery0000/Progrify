import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import useUserProfile from '../hooks/useUserProfile';
import LevelIndicator from './LevelIndicator';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, loading } = useUserProfile();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between h-16 items-center p-4 md:p-6">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-teal-600">Progrify</h1>
          </div>

          <div className="hidden md:block">
            {!loading && userProfile && (
              <LevelIndicator
                level={userProfile.level}
                experience={userProfile.experience}
                experienceToNextLevel={userProfile.experienceToNextLevel}
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>

            <div className="h-8 w-8 rounded-full bg-teal-500 text-white flex items-center justify-center">
              {userProfile?.displayName?.charAt(0) || userProfile?.email?.charAt(0) || '?'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;