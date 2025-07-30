import React from 'react';
import FooterComponent from '../components/layout/FooterNew';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import NavbarNew from '../components/layout/NavbarNew';

const Dashboard: React.FC = () => {
  const upcomingFeatures = [
    {
      title: "Problem Management",
      description: "Add, edit, and organize coding problems with difficulty levels and tags",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      status: "Planning"
    },
    {
      title: "Problem Review System",
      description: "Review and approve user-submitted problems before publication",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      status: "Planning"
    },
    {
      title: "User Role Management",
      description: "Assign roles, manage permissions, and control user access levels",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      status: "Planning"
    },
    {
      title: "Platform Statistics",
      description: "View detailed analytics, user engagement metrics, and performance insights",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      status: "Planning"
    },
    {
      title: "Content Moderation",
      description: "Monitor discussions, manage reports, and maintain community standards",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      status: "Planning"
    },
    {
      title: "System Configuration",
      description: "Configure platform settings, manage integrations, and system preferences",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      status: "Planning"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-y-scroll">
        
      <div className="container mx-auto px-4 py-8 ">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#3bb96a] to-[#5dd65f] rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Admin Dashboard
          </h1>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            The administrative control center for managing problems, users, and platform operations. 
            Monitor performance, review content, and configure system settings all in one place.
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

        {/* Information Section */}
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-8 text-center backdrop-blur-sm">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[#3bb96a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            Dashboard Under Development
          </h2>
          
          <p className="text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
            We're building a comprehensive admin dashboard that will give you complete control over your coding platform. 
            This powerful interface will enable efficient content management, user administration, and detailed analytics 
            to help you make data-driven decisions.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-[#3bb96a] rounded-full mr-2"></div>
              Admin Only Access
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-[#3bb96a] rounded-full mr-2"></div>
              Full Platform Control
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-[#3bb96a] rounded-full mr-2"></div>
              Real-time Analytics
            </span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            This dashboard is exclusively for administrators and will provide comprehensive platform management capabilities.
          </p>
        </div>
      </div>
      {/* //<Footer/> */}
    </div>
  );
};

export default Dashboard;
