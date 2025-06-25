
import React, { useEffect, useRef } from 'react';
import { User, Settings, LogOut, Trophy, BarChart3 } from 'lucide-react';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ isOpen, onClose, userName, userEmail }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-lg rounded-xl border border-gray-700 shadow-xl py-2 z-50"
    >
      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {userName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">{userName}</p>
            <p className="text-gray-400 text-xs">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <a
          href="#"
          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200"
        >
          <User className="w-4 h-4" />
          <span className="text-sm">Profile</span>
        </a>
        
        <a
          href="#"
          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-sm">Progress</span>
        </a>
        
        <a
          href="#"
          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200"
        >
          <Trophy className="w-4 h-4" />
          <span className="text-sm">Achievements</span>
        </a>
        
        <a
          href="#"
          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </a>
      </div>

      {/* Logout */}
      <div className="border-t border-gray-700 pt-2">
        <button
          className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700/50 transition-colors duration-200 w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;