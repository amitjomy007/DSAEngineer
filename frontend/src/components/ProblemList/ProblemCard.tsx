
import React from 'react';
import { Clock, Users, Star, Bookmark, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Tag } from '../admin/ProblemList';
interface ProblemCardProps {
  id: string;
  title: string;
  difficulty: string;
  acceptanceRate: number;
  tags: Tag[];
  status: string;
  isBookmarked?: boolean;
  likes?: number;
  submissions?: number;
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  id,
  title,
  difficulty,
  acceptanceRate,
  tags,
  status,
  isBookmarked = false,
  likes = 0,
  submissions = 0
}) => {
  const Navigate = useNavigate();
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Hard':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'solved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'attempted':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };
  
    const handleSolveProblem = (problemTitle:string) => {
    Navigate("/solve");
    console.log("Not yet navigating dynamically to: ", problemTitle);
  };

  return (
    <div 
    onClick = {() => handleSolveProblem(title)}
    className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/60 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-white font-medium text-lg group-hover:text-purple-300 transition-colors duration-200 cursor-pointer">
              {id}. {title}
            </h3>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(difficulty)}`}>
                {difficulty}
              </span>
              <span className="text-gray-400 text-sm">
                {acceptanceRate}% accepted
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className={`p-2 rounded-lg transition-colors duration-200 ${
            isBookmarked 
              ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20' 
              : 'text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10'
          }`}>
            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="text-xs px-2 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-md hover:bg-purple-500/20 transition-colors duration-200 cursor-pointer"
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{submissions}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-xs">
          <Clock className="w-3 h-3" />
          <span>2 days ago</span>
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;