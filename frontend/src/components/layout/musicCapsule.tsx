import React, { useState } from 'react';

interface SpotifyCapsuleProps {}

const SpotifyCapsule: React.FC<SpotifyCapsuleProps> = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleSpotifyClick = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 2000);
  };

  return (
    <div className="relative">
      {/* Coming Soon Popup */}
      {showComingSoon && (
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-950 text-white text-xs rounded-md shadow-lg border border-gray-600 z-50">
          <span>Coming Soon!</span>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}

      {/* Spotify Player Capsule */}
      <div 
        className="group flex items-center bg-black/90 border border-gray-700/60 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:w-80 w-32 h-8"
        onClick={handleSpotifyClick}
      >
        {/* Spotify Icon - Always Visible */}
        <div className="flex items-center justify-center w-6 h-6 bg-[#1db954] rounded-full ml-1 shadow-sm flex-shrink-0">
          <svg
            className="w-3 h-3 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </div>

        {/* Minimal Equalizer - Only in Idle State */}
        <div className="flex items-center ml-2 mr-1 group-hover:hidden">
          <div className="flex items-center space-x-0.5">
            <div className="w-0.5 h-2 bg-[#1db954] rounded-full animate-pulse"></div>
            <div className="w-0.5 h-3 bg-[#1db954] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-0.5 h-2 bg-[#1db954] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>

        {/* Music Info - Show on Hover */}
        <div className="hidden group-hover:flex flex-col min-w-0 mx-3 py-1">
          <div className="flex items-center">
            <span className="text-xs font-medium text-white truncate">
              Focus Music
            </span>
            <div className="flex items-center ml-2">
              <div className="w-1 h-1 bg-[#1db954] rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-[#1db954] rounded-full animate-pulse mx-0.5" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1 h-1 bg-[#1db954] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
          <span className="text-xs text-gray-400 truncate">Coding Playlist</span>
        </div>

        {/* Control Buttons - Show on Hover */}
        <div className="hidden group-hover:flex items-center space-x-2 mr-3">
          <div className="w-6 h-6 flex items-center justify-center bg-gray-700/50 rounded-full hover:bg-gray-600/60 transition-colors">
            <svg
              className="w-3 h-3 text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </div>
          
          <div className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
            <svg
              className="w-3 h-3 text-gray-800"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          
          <div className="w-6 h-6 flex items-center justify-center bg-gray-700/50 rounded-full hover:bg-gray-600/60 transition-colors">
            <svg
              className="w-3 h-3 text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </div>
        </div>

        {/* Progress Bar - Show on Hover */}
        <div className="hidden group-hover:flex items-center ml-2 mr-3 min-w-0">
          <span className="text-xs text-gray-400 mr-2">2:31</span>
          <div className="w-16 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1db954] rounded-full transition-all duration-300"
              style={{ width: '45%' }}
            ></div>
          </div>
          <span className="text-xs text-gray-400 ml-2">5:42</span>
        </div>
      </div>
    </div>
  );
};

export default SpotifyCapsule;
