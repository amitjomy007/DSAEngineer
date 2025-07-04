import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  CheckCircle,
  Clock,
  Circle,
  ThumbsUp,
  ThumbsDown,
  Users,
  Filter,
} from "lucide-react";

// Interface definitions
interface ITestCase {
  input: string;
  output: string;
  _id?: string;
}

interface IExample {
  input: string;
  output: string;
  explanation?: string;
  _id?: string;
}

interface ProblemPreview {
  _id: string;
  id: number;
  isApproved: boolean;
  problemAuthorId: string;
  problemCreatedDate: string;
  problemLastModifiedDate: string;
  problemNumber: number;
  title: string;
  titleSlug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
  examples: IExample[];
  constraints: string[];
  hints: string[];
  testcases: ITestCase[];
  timeLimit: number;
  memoryLimit: number;
  allowedLanguages: string[];
  editorialId: string;
  successfulSubmissionCount: number;
  failedSubmissionCount: number;
  upvoteCount: number;
  downvoteCount: number;
  userProblemStatus: "solved" | "attempted" | "unattempted";
  userVoteStatus: "upvoted" | "downvoted" | "none";
}

// Mock data for testing
const mockProblems: ProblemPreview[] = [
  {
    _id: "1",
    id: 1,
    isApproved: true,
    problemAuthorId: "author1",
    problemCreatedDate: "2024-01-01T00:00:00Z",
    problemLastModifiedDate: "2024-01-01T00:00:00Z",
    problemNumber: 1,
    title: "Two Sum",
    titleSlug: "two-sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [],
    constraints: [],
    hints: [],
    testcases: [],
    timeLimit: 1000,
    memoryLimit: 256,
    allowedLanguages: ["JavaScript", "Python", "Java"],
    editorialId: "editorial1",
    successfulSubmissionCount: 1500,
    failedSubmissionCount: 500,
    upvoteCount: 250,
    downvoteCount: 12,
    userProblemStatus: "solved",
    userVoteStatus: "upvoted",
  },
  {
    _id: "2",
    id: 2,
    isApproved: true,
    problemAuthorId: "author2",
    problemCreatedDate: "2024-01-02T00:00:00Z",
    problemLastModifiedDate: "2024-01-02T00:00:00Z",
    problemNumber: 2,
    title: "Add Two Numbers",
    titleSlug: "add-two-numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math", "Recursion"],
    description:
      "You are given two non-empty linked lists representing two non-negative integers.",
    examples: [],
    constraints: [],
    hints: [],
    testcases: [],
    timeLimit: 2000,
    memoryLimit: 512,
    allowedLanguages: ["JavaScript", "Python", "Java", "C++"],
    editorialId: "editorial2",
    successfulSubmissionCount: 800,
    failedSubmissionCount: 1200,
    upvoteCount: 180,
    downvoteCount: 25,
    userProblemStatus: "attempted",
    userVoteStatus: "none",
  },
  {
    _id: "3",
    id: 3,
    isApproved: true,
    problemAuthorId: "author3",
    problemCreatedDate: "2024-01-03T00:00:00Z",
    problemLastModifiedDate: "2024-01-03T00:00:00Z",
    problemNumber: 3,
    title: "Longest Substring Without Repeating Characters",
    titleSlug: "longest-substring-without-repeating-characters",
    difficulty: "Hard",
    tags: ["Hash Table", "String", "Sliding Window"],
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [],
    constraints: [],
    hints: [],
    testcases: [],
    timeLimit: 3000,
    memoryLimit: 1024,
    allowedLanguages: ["JavaScript", "Python", "Java", "C++", "Go"],
    editorialId: "editorial3",
    successfulSubmissionCount: 300,
    failedSubmissionCount: 700,
    upvoteCount: 95,
    downvoteCount: 8,
    userProblemStatus: "unattempted",
    userVoteStatus: "none",
  },
];

const Problems: React.FC = () => {
  const [problems, setProblems] = useState<ProblemPreview[]>([]);
  const [hasFetchedProblems, setHasFetchedProblems] = useState(false);
  const [filteredProblems, setFilteredProblems] = useState<ProblemPreview[]>(
    []
  );
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("number");
  const navigate = useNavigate();

  const fetchResponse = async () => {
    const uId = Cookies.get("userId");
    return await axios.get(`http://localhost:8000/problems`, {
      headers: {
        "user-id": uId,
      },
    });
  };
  useEffect(() => {
  const fetchData = async () => {
    const userId = Cookies.get("userId");
    console.log("User ID: ", userId);

    try {
      const response = await fetchResponse();
      console.log("Response: ", response);
      console.log("mock problems print to fix error: ", mockProblems);
      setProblems(response.data.problems); 
      setHasFetchedProblems(true);
      console.log("Problem before setting: ", response.data);
      // Don't log problems here - it will show the old state
    } catch (error) {
      console.error("Caught error: ", error);
    }
  };

  // Only run if we haven't fetched problems yet
  if (!hasFetchedProblems) {
    fetchData();
  }
}, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    let filtered = [...problems];

    // Filter by difficulty
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(
        (problem) => problem.difficulty === difficultyFilter
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (problem) => problem.userProblemStatus === statusFilter
      );
    }

    // Sort
    const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "acceptance":
          return (
            calculateAcceptanceRate(
              a.successfulSubmissionCount,
              a.failedSubmissionCount
            ) -
            calculateAcceptanceRate(
              b.successfulSubmissionCount,
              b.failedSubmissionCount
            )
          );

        case "difficulty":
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return a.problemNumber - b.problemNumber;
      }
    });

    setFilteredProblems(filtered);
  }, [problems, difficultyFilter, statusFilter, sortBy]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "attempted":
        return <Clock className="w-5 h-5 text-amber-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusTooltip = (status: string) => {
    switch (status) {
      case "solved":
        return "Solved";
      case "attempted":
        return "Attempted";
      default:
        return "Not attempted";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const calculateAcceptanceRate = (successful: number, failed: number) => {
    const total = successful + failed;
    if (total === 0) return 0;
    return Math.round((successful / total) * 100);
  };

  const handleSolveProblem = (titleSlug: string) => {
    navigate(`/problems/${titleSlug}`);
  };

  //const uniqueTags = Array.from(new Set(problems.flatMap(p => p.tags)));

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-950 relative overflow-hidden">
        {/* Enhanced Background with purple theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-violet-900/20 to-gray-900"></div>

        {/* Mesh Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(147,51,234,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(99,102,241,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1),transparent_50%)]"></div>
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(147,51,234,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent mb-4">
              Practice Problems
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Sharpen your coding skills with our curated collection of
              algorithmic challenges
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 max-w-6xl mx-auto">
            <Card className="bg-gray-900/60 border-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">
                    Filters & Sorting
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <Select
                      value={difficultyFilter}
                      onValueChange={setDifficultyFilter}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="solved">Solved</SelectItem>
                        <SelectItem value="attempted">Attempted</SelectItem>
                        <SelectItem value="unattempted">
                          Not Attempted
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sort By
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="number">Problem Number</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="difficulty">Difficulty</SelectItem>
                        <SelectItem value="acceptance">
                          Acceptance Rate
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <div className="text-sm text-gray-400">
                      Showing {filteredProblems.length} of {problems.length}{" "}
                      problems
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Problems Grid */}
          <div className="space-y-4 max-w-6xl mx-auto">
            {filteredProblems.map((problem) => (
              <Card
                key={problem._id}
                className="bg-gray-900/60 border-gray-800/50 backdrop-blur-sm hover:bg-gray-900/80 transition-all duration-300 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 group"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Section - Problem Info */}
                    <div className="flex-1 space-y-3">
                      {/* Title and Status */}
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 mt-1">
                          <Tooltip>
                            <TooltipTrigger>
                              {getStatusIcon(problem.userProblemStatus)}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {getStatusTooltip(problem.userProblemStatus)}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                          <span className="text-sm font-medium text-gray-400">
                            #{problem.problemNumber}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white hover:text-purple-400 transition-colors cursor-pointer group-hover:text-purple-300">
                            {problem.title}
                          </h3>
                        </div>
                      </div>

                      {/* Difficulty and Acceptance Rate */}
                      <div className="flex flex-wrap items-center gap-4">
                        <Badge
                          className={`${getDifficultyColor(
                            problem.difficulty
                          )} border font-medium`}
                        >
                          {problem.difficulty}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                          <span>
                            {calculateAcceptanceRate(
                              problem.successfulSubmissionCount,
                              problem.failedSubmissionCount
                            )}
                            % Acceptance
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {problem.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs border-gray-700 text-gray-300 hover:border-purple-500 hover:text-purple-400 transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Right Section - Stats and Action */}
                    <div className="flex flex-col lg:items-end gap-4">
                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{problem.upvoteCount}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Upvotes</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors">
                              <ThumbsDown className="w-4 h-4" />
                              <span>{problem.downvoteCount}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Downvotes</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                              <Users className="w-4 h-4" />
                              <span>{problem.successfulSubmissionCount}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>People who solved this problem</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Solve Button */}
                      <Button
                        onClick={() => handleSolveProblem(problem.titleSlug)}
                        className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                      >
                        Solve Problem
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredProblems.length === 0 && problems.length > 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg">
                No problems match the current filters.
              </div>
              <Button
                onClick={() => {
                  setDifficultyFilter("all");
                  setStatusFilter("all");
                  setSortBy("number");
                }}
                variant="outline"
                className="mt-4 border-purple-500 text-purple-400 hover:bg-purple-500/10"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {problems.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg">
                No problems available at the moment.
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Problems;
