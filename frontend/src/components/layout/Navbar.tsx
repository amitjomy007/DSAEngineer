import React, { useState } from "react";
// import { Search, User, LogOut, BookOpen, ChevronDown } from 'lucide-react';
import { BookOpen, ChevronDown } from "lucide-react";
import UserDropdown from "./UserDropdown";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
  userEmail?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn = true,
  userName = "Alex Chen",
  userEmail = "alex.chen@example.com",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const Navigate = useNavigate();
  isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const handleAuthButtons = (route:string) => {
    Navigate(route);
  }

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                CodeForge
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-purple-400 font-medium border-b-2 border-purple-400 pb-1"
            >
              Problems
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Contests
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Discuss
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg px-3 py-2 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <span className="hidden sm:block text-gray-300 text-sm">
                    {userName}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                <UserDropdown
                  isOpen={isDropdownOpen}
                  onClose={() => setIsDropdownOpen(false)}
                  userName={userName}
                  userEmail={userEmail}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200"
                onClick = {() => handleAuthButtons("/login")}>
                  Sign In
                </button>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                onClick = {() => handleAuthButtons("/register")}>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
