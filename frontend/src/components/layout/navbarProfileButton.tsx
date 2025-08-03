import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
interface UserMenuProps {}

const UserMenu: React.FC<UserMenuProps> = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by checking cookies
    const userCookie = Cookies.get("user31d6cfe0d16ae931b73c59d7e0c089c0");
    const tokenCookie = Cookies.get("token31d6cfe0d16ae931b73c59d7e0c089c0");

    if (userCookie && tokenCookie) {
      setIsLoggedIn(true);
      // Parse username from cookie (remove quotes and convert to camelCase)
      const parsedUsername = userCookie.replace(/['"]/g, "");
      const camelCaseUsername =
        parsedUsername.charAt(0).toUpperCase() +
        parsedUsername.slice(1).toLowerCase();
      setUserName(camelCaseUsername);

      // Extract email from token (you might need to decode JWT properly)
      try {
        const token = tokenCookie.replace(/['"]/g, "");
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        const decoded = JSON.parse(jsonPayload);
        setUserEmail(decoded.user?.email || "user@example.com");
      } catch (error) {
        setUserEmail("user@example.com");
      }
    }
  }, []);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    // Remove all user-related cookies
    Cookies.remove("user31d6cfe0d16ae931b73c59d7e0c089c0");
    Cookies.remove("token31d6cfe0d16ae931b73c59d7e0c089c0");
    Cookies.remove("userId31d6cfe0d16ae931b73c59d7e0c089c0");
    Cookies.remove("stopwatch_running");
    Cookies.remove("stopwatch_start_time");
    Cookies.remove("stopwatch_time");

    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleProfile = () => {
    const userId = Cookies.get("userId31d6cfe0d16ae931b73c59d7e0c089c0");
    if (!userId) return;
    else {
      const formattedUserId = userId.trim().replace(/^"+|"+$/g, "");
      navigate(`/profile/${formattedUserId}`);
      setIsMenuOpen(false);
    }
  };

const handleDashboard = async () => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    // Get userId from cookies
    const userId = Cookies.get('userId31d6cfe0d16ae931b73c59d7e0c089c0');
    
    if (!userId) {
      console.error('User ID not found in cookies');
      return;
    }

    // Make API call to get user profile data (which includes role)
    const response = await axios.get(`${backendUrl}/api/user/profile/${userId}`, {
      withCredentials: true,
      headers: {
        'user-id': userId
      }
    });

    // Extract role from response
    const userRole = response.data.data.role;

    // Role-based redirection
    if (userRole === 'user' || userRole === undefined) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/rbacdashboard';
    }

  } catch (error) {
    console.error('Error handling dashboard redirect:', error);
    // Handle error - maybe redirect to login or show error message
  }
};


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!isLoggedIn) {
    return (
      <button
        onClick={handleLogin}
        className="group relative h-9 px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#3bb96a] to-[#5dd65f] hover:from-[#329555] hover:to-[#4dc450] rounded-md shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border border-[#3bb96a]/20"
      >
        <span className="flex items-center">
          <svg
            className="w-3 h-3 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m0 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Login
        </span>
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="group flex items-center h-9 px-3 text-xs font-medium text-gray-100 bg-gray-800/90 hover:bg-gray-700/90 rounded-md border border-gray-600/50 hover:border-[#3bb96a]/40 transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm"
      >
        <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-[#3bb96a] to-[#5dd65f] rounded-full mr-2 shadow-sm">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <span className="mr-1.5 font-medium text-xs">{userName}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 text-[#3bb96a] ${
            isMenuOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800/95 border border-gray-600/50 rounded-lg shadow-xl z-50 backdrop-blur-md">
          {/* User Info Section - Compact */}
          <div className="px-3 py-2 border-b border-gray-600/50">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-[#3bb96a] to-[#5dd65f] rounded-full shadow-sm">
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="ml-2">
                <p className="text-xs font-medium text-white">{userName}</p>
                <p className="text-xs text-gray-400 truncate">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Menu Items - Compact */}
          <div className="py-1 z-20">
            <button
              onClick={handleProfile}
              className="flex items-center w-full px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-gray-700/60 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-6 h-6 bg-gray-700 group-hover:bg-[#3bb96a]/20 rounded-md mr-2 transition-colors duration-200">
                <svg
                  className="w-3 h-3 text-gray-400 group-hover:text-[#3bb96a]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="font-medium">Profile</span>
            </button>

            <button
              onClick={handleDashboard}
              className="flex items-center w-full px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-gray-700/60 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-6 h-6 bg-gray-700 group-hover:bg-[#3bb96a]/20 rounded-md mr-2 transition-colors duration-200">
                <svg
                  className="w-3 h-3 text-gray-400 group-hover:text-[#3bb96a]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span className="font-medium">Dashboard</span>
            </button>

            <hr className="my-1 border-gray-600/50" />

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-6 h-6 bg-gray-700 group-hover:bg-red-500/20 rounded-md mr-2 transition-colors duration-200">
                <svg
                  className="w-3 h-3 text-red-400 group-hover:text-red-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
