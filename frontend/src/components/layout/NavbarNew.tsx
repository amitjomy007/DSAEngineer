import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserMenu from './navbarProfileButton';
import SpotifyCapsule from './musicCapsule';

interface NavbarProps {}

const NavbarNew: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-[100] bg-gray-900/95 border-b border-gray-700/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          
          {/* Left Section - Brand & Navigation */}
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-white mr-8">DSAEngineer</h1>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => handleNavigation('/problems')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/problems')
                    ? 'bg-[#3bb96a]/20 text-[#3bb96a] border border-[#3bb96a]/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                Problems
              </button>
              
              <button
                onClick={() => handleNavigation('/contests')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/contests')
                    ? 'bg-[#3bb96a]/20 text-[#3bb96a] border border-[#3bb96a]/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                Contest
              </button>
            </div>
          </div>

          {/* Center Section - Spotify Music Player */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <SpotifyCapsule/>
          </div>

          {/* Right Section - User Menu */}
          <div className="flex items-center">
            <UserMenu/>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-400 hover:text-white p-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden border-t border-gray-700/50 py-2">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleNavigation('/problems')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 text-left ${
                isActive('/problems')
                  ? 'bg-[#3bb96a]/20 text-[#3bb96a] border border-[#3bb96a]/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              Problems
            </button>
            
            <button
              onClick={() => handleNavigation('/contests')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 text-left ${
                isActive('/contests')
                  ? 'bg-[#3bb96a]/20 text-[#3bb96a] border border-[#3bb96a]/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              Contest
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarNew;
