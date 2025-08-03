import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserMenu from './navbarProfileButton';
import SpotifyCapsule from './musicCapsule';

interface NavbarProps {}

const NavbarNew: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-[100] bg-gray-900/95 border-b border-gray-700/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          
          {/* Left Section - Brand & Navigation */}
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-white mr-8">DSAEngineer</h1>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => handleNavigation('/problems')}
                className={`relative px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive('/problems')
                    ? 'text-[#3bb96a]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Problems
                {isActive('/problems') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3bb96a] rounded-full"></div>
                )}
              </button>
              
              <button
                onClick={() => handleNavigation('/contests')}
                className={`relative px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive('/contests')
                    ? 'text-[#3bb96a]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Contest
                {isActive('/contests') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3bb96a] rounded-full"></div>
                )}
              </button>
            </div>
          </div>

          {/* Center Section - Spotify Music Player (Desktop only) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <SpotifyCapsule/>
          </div>

          {/* Right Section - User Menu & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* User Menu */}
            <UserMenu/>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-400 hover:text-white p-2 transition-colors duration-200"
            >
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="border-t border-gray-700/50 py-2">
            {/* Mobile Spotify Player */}
            <div className="px-4 py-2 border-b border-gray-700/30 mb-2">
              <SpotifyCapsule/>
            </div>
            
            {/* Mobile Navigation Links */}
            <div className="flex flex-col">
              <button
                onClick={() => handleNavigation('/problems')}
                className={`relative px-4 py-3 text-sm font-medium transition-all duration-300 text-left ${
                  isActive('/problems')
                    ? 'text-[#3bb96a] bg-[#3bb96a]/5'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                }`}
              >
                Problems
                {isActive('/problems') && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3bb96a] rounded-r-full"></div>
                )}
              </button>
              
              <button
                onClick={() => handleNavigation('/contests')}
                className={`relative px-4 py-3 text-sm font-medium transition-all duration-300 text-left ${
                  isActive('/contests')
                    ? 'text-[#3bb96a] bg-[#3bb96a]/5'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                }`}
              >
                Contest
                {isActive('/contests') && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3bb96a] rounded-r-full"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarNew;
