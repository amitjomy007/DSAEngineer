
import React from 'react';
import { Heart, Github, Twitter, Linkedin, Code } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                CodeForge
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4 max-w-md">
              Master your coding skills with our comprehensive collection of programming challenges. 
              Built for developers, by developers.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
              <span>using React + Tailwind CSS</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
                  Problems
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
                  Contests
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
                  Discuss
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
                  Premium
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">
            © 2024 CodeForge. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <a
              href="#"
              className="text-gray-500 hover:text-purple-400 transition-colors duration-200"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-purple-400 transition-colors duration-200"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-purple-400 transition-colors duration-200"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
