import React from 'react';
import NavbarNew from '../components/layout/NavbarNew';

const Contests: React.FC = () => {
  const upcomingFeatures = [
    {
      title: "Weekly Coding Contests",
      description: "Participate in timed programming competitions with real-time leaderboards",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      status: "Planning"
    },
    {
      title: "Rating System",
      description: "Track your competitive programming rating across different contest formats",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      status: "Planning"
    },
    // {
    //   title: "Virtual Contests",
    //   description: "Practice with past contest problems in a simulated contest environment",
    //   icon: (
    //     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    //     </svg>
    //   ),
    //   status: "Planning"
    // },
    
    {
      title: "Contest Analytics",
      description: "Detailed performance analysis and insights from your contest participations",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      status: "Planning"
    },
    
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-y-scroll">
      <NavbarNew/>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#3bb96a] to-[#5dd65f] rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Programming Contests
          </h1>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            Compete with programmers worldwide in timed coding challenges. Test your algorithmic skills, 
            climb the leaderboards, and prove your expertise in competitive programming contests.
          </p>

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#3bb96a]/20 to-[#5dd65f]/20 border border-[#3bb96a]/30 rounded-full">
            <div className="w-2 h-2 bg-[#3bb96a] rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium text-[#3bb96a]">Coming Soon</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {upcomingFeatures.map((feature, index) => (
            <div
              key={index}
              className="group bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 hover:border-[#3bb96a]/30 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-start">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-700/50 group-hover:bg-[#3bb96a]/20 rounded-lg mr-4 transition-colors duration-300">
                  <div className="text-gray-400 group-hover:text-[#3bb96a]">
                    {feature.icon}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#3bb96a] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-gray-700/50 text-gray-400 rounded-md">
                      {feature.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contest Types Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#3bb96a] to-[#5dd65f] rounded-lg mr-3 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Speed Contests</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Fast-paced competitions focusing on quick problem-solving and implementation speed.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="flex items-center mr-4">
                <div className="w-2 h-2 bg-[#3bb96a] rounded-full mr-2"></div>
                30-90 minutes
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-[#3bb96a] rounded-full mr-2"></div>
                3-5 problems
              </span>
            </div>
          </div>

          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#3bb96a] to-[#5dd65f] rounded-lg mr-3 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Algorithm Marathons</h3>
            </div>
            <p className="text-gray-400 mb-4">
              In-depth algorithmic challenges requiring advanced problem-solving techniques.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="flex items-center mr-4">
                <div className="w-2 h-2 bg-[#3bb96a] rounded-full mr-2"></div>
                2-5 hours
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-[#3bb96a] rounded-full mr-2"></div>
                5-8 problems
              </span>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-8 text-center backdrop-blur-sm">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[#3bb96a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            Competitive Programming Platform
          </h2>
          
          <p className="text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
            We're building a comprehensive contest platform that will feature live competitions, detailed performance analytics, 
            and a robust rating system. Join thousands of programmers in challenging contests designed to push your 
            algorithmic thinking to the next level.
          </p>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-[#3bb96a] rounded-full mr-2"></div>
              Real-time Contests
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-[#3bb96a] rounded-full mr-2"></div>
              Global Leaderboards
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-[#3bb96a] rounded-full mr-2"></div>
              Rating System
            </span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Contest features are in development and will be available soon for all registered users.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contests;
