import { Clock, Heart, BookOpen, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from "../ui/button";
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import ReportProblemForm from './ReportProblemForm';
interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptanceRate: string;
  tags: Array<{
    name: string;
    color: string;
  }>;
  likes: number;
  submissions: number;
  timeAgo: string;
  status?: 'solved' | 'attempted' | 'reported';
  isBookmarked?: boolean;
}

interface ProblemCardWithSubmissionsProps {
  problem: Problem;
  onViewSubmissions?: (problemId: number, problemTitle: string) => void;
}

const ProblemCardWithSubmissions = ({ problem, onViewSubmissions }: ProblemCardWithSubmissionsProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'solved':
        return 'bg-green-500/20 text-green-400';
      case 'attempted':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'reported':
        return 'bg-red-500/20 text-red-400';
      default:
        return '';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-white hover:text-purple-400 cursor-pointer">
                {problem.title}
              </h3>
              {problem.status && (
                <Badge variant="outline" className={`${getStatusColor(problem.status)} border-current`}>
                  {problem.status}
                </Badge>
              )}
              {problem.isBookmarked && (
                <Heart className="w-4 h-4 text-red-400 fill-current" />
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
              <span className={`font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span>Acceptance: {problem.acceptanceRate}</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{problem.timeAgo}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {problem.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`${tag.color} border-current text-xs`}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{problem.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{problem.submissions} submissions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewSubmissions?.(problem.id, problem.title)}
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Submissions
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
          
          <ReportProblemForm 
            problemId={problem.id} 
            problemTitle={problem.title}
            onSubmit={(data) => console.log('Report submitted:', data)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemCardWithSubmissions;