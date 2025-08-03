/// <reference types="styled-jsx" />

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
  Grid3X3,
  List,
  BarChart3,
  Target,
  Trophy,
  BookOpen,
  Heart,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import NavbarNew from "../../components/layout/NavbarNew";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "3000";
console.log("backendUrl:", backendUrl);

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

interface UserStats {
  totalProblems: number;
  solvedProblems: number;
  attemptedProblems: number;
  upvotedProblems: number;
  topTopics: { topic: string; count: number }[];
}

const Problems: React.FC = () => {
  const [problems, setProblems] = useState<ProblemPreview[]>([]);
  const [hasFetchedProblems, setHasFetchedProblems] = useState(false);
  const [filteredProblems, setFilteredProblems] = useState<ProblemPreview[]>(
    []
  );
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("number");
  const [viewMode, setViewMode] = useState<"list" | "card">(() => {
    return (
      (Cookies.get("viewModeId31d6cfe0d16ae931b73c59d7e0c089c0") as
        | "list"
        | "card") || "list"
    );
  });
  const navigate = useNavigate();

  const fetchResponse = async () => {
    const uId = Cookies.get("userId31d6cfe0d16ae931b73c59d7e0c089c0");
    let userId = undefined;
    if (uId) userId = uId.replace(/^"+|"+$/g, "");
    else {
      console.log("please login");
      return;
    }
    return await axios.get(`${backendUrl}/problems`, {
      headers: {
        "user-id": userId,
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = Cookies.get("userId31d6cfe0d16ae931b73c59d7e0c089c0");
      console.log("User ID: ", userId);

      try {
        const response = await fetchResponse();
        if (!response) return;
        console.log("Response: ", response);

        setProblems(response.data.problems);
        setHasFetchedProblems(true);
        console.log("Problem before setting: ", response.data);
      } catch (error) {
        console.error("Caught error: ", error);
      }
    };

    if (!hasFetchedProblems) {
      fetchData();
    }
  }, []);

  // Calculate user statistics
  const getUserStats = (): UserStats => {
    const totalProblems = problems.length;
    const solvedProblems = problems.filter(
      (p) => p.userProblemStatus === "solved"
    ).length;
    const attemptedProblems = problems.filter(
      (p) => p.userProblemStatus === "attempted"
    ).length;
    const upvotedProblems = problems.filter(
      (p) => p.userVoteStatus === "upvoted"
    ).length;

    // Calculate top topics
    const topicCounts: Record<string, number> = {};
    problems.forEach((problem) => {
      if (problem.userProblemStatus === "solved") {
        problem.tags.forEach((tag) => {
          topicCounts[tag] = (topicCounts[tag] || 0) + 1;
        });
      }
    });

    const topTopics = Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    return {
      totalProblems,
      solvedProblems,
      attemptedProblems,
      upvotedProblems,
      topTopics,
    };
  };

  // Get all unique topics for filtering
  const getAllTopics = () => {
    const topicCounts: Record<string, number> = {};
    problems.forEach((problem) => {
      problem.tags.forEach((tag) => {
        topicCounts[tag] = (topicCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([topic]) => topic);
  };

  // Convert to Title Case
  const toTitleCase = (str: string) => {
    return str
      .split(/[\s-_]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    let filtered = [...problems];

    // Filter by difficulty
    if (difficultyFilter && difficultyFilter !== "") {
      filtered = filtered.filter(
        (problem) => problem.difficulty === difficultyFilter
      );
    }

    // Filter by status
    if (statusFilter && statusFilter !== "") {
      filtered = filtered.filter(
        (problem) => problem.userProblemStatus === statusFilter
      );
    }

    // Filter by selected topics (multi-select)
    if (selectedTopics.length > 0) {
      filtered = filtered.filter((problem) =>
        selectedTopics.some((topic) => problem.tags.includes(topic))
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
  }, [problems, difficultyFilter, statusFilter, selectedTopics, sortBy]);

  const setViewModeAndSave = (mode: "list" | "card") => {
    setViewMode(mode);
    Cookies.set("viewModeId31d6cfe0d16ae931b73c59d7e0c089c0", mode);
  };

  const handleRandomProblem = () => {
    if (filteredProblems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredProblems.length);
    const randomProblem = filteredProblems[randomIndex];
    navigate(`/problems/${randomProblem.titleSlug}`);
  };

  const toggleTopicSelection = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const resetAllFilters = () => {
    setDifficultyFilter("");
    setStatusFilter("");
    setSelectedTopics([]);
    setSortBy("number");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "attempted":
        return <Clock className="w-4 h-4 text-amber-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-500" />;
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
        return "bg-emerald-500/20 text-emerald-400";
      case "Medium":
        return "bg-amber-500/20 text-amber-400";
      case "Hard":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
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

  const userStats = getUserStats();
  const allTopics = getAllTopics();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-950 relative">
        {/* Fixed Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <NavbarNew />
        </div>

        {/* Main Content with top padding to account for fixed navbar */}
        <div className="pt-16 h-screen flex flex-col">
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
          <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
            <div className="container mx-auto px-4 py-4 flex-1 flex flex-col overflow-hidden">
              {/* Left-aligned Header with Random Button */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-left">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent mb-2 font-['Inter',_'system-ui',_sans-serif]">
                    Practice Problems
                  </h1>
                  <p className="text-sm text-gray-400 font-['Inter',_'system-ui',_sans-serif]">
                    Sharpen your coding skills with algorithmic challenges
                  </p>
                </div>
                <Button
                  onClick={handleRandomProblem}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 font-['Inter',_'system-ui',_sans-serif] flex items-center gap-2"
                >
                  <Shuffle className="w-4 h-4" />
                  Solve Random
                </Button>
              </div>

              {/* Statistics Cards */}
              <div className="mb-4 max-w-6xl mx-auto w-full">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <Card className="bg-gray-900/60 border-gray-800/50 backdrop-blur-sm">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="text-lg font-bold text-white font-mono">
                            {userStats.totalProblems}
                          </div>
                          <div className="text-xs text-gray-400 font-['Inter',_'system-ui',_sans-serif]">
                            Total
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/60 border-gray-800/50 backdrop-blur-sm">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-lg font-bold text-emerald-400 font-mono">
                            {userStats.solvedProblems}
                          </div>
                          <div className="text-xs text-gray-400 font-['Inter',_'system-ui',_sans-serif]">
                            Solved
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/60 border-gray-800/50 backdrop-blur-sm">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-amber-400" />
                        <div>
                          <div className="text-lg font-bold text-amber-400 font-mono">
                            {userStats.attemptedProblems}
                          </div>
                          <div className="text-xs text-gray-400 font-['Inter',_'system-ui',_sans-serif]">
                            Attempted
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/60 border-gray-800/50 backdrop-blur-sm">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-400" />
                        <div>
                          <div className="text-lg font-bold text-red-400 font-mono">
                            {userStats.upvotedProblems}
                          </div>
                          <div className="text-xs text-gray-400 font-['Inter',_'system-ui',_sans-serif]">
                            Upvoted
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/60 border-gray-800/50 backdrop-blur-sm">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-lg font-bold text-purple-400 font-mono">
                            {userStats.topTopics[0]?.topic
                              ? toTitleCase(userStats.topTopics[0].topic)
                              : "None"}
                          </div>
                          <div className="text-xs text-gray-400 font-['Inter',_'system-ui',_sans-serif]">
                            Top Topic
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Filters - Reorganized Layout */}
              <div className="mb-4 max-w-6xl mx-auto w-full">
                <Card className="bg-gray-900/60 border-gray-800/50 backdrop-blur-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-4">
                      {/* Topics Container - Left Side */}
                      <div
                        className="flex-1 overflow-x-auto overflow-y-hidden"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        <div
                          className="flex gap-2 pb-1"
                          style={{ width: "max-content" }}
                        >
                          {allTopics.map((topic) => (
                            <Button
                              key={topic}
                              size="sm"
                              variant={
                                selectedTopics.includes(topic)
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => toggleTopicSelection(topic)}
                              className={`h-7 px-3 text-xs whitespace-nowrap flex-shrink-0 font-['Inter',_'system-ui',_sans-serif] min-w-[80px] border-0 ${
                                selectedTopics.includes(topic)
                                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                                  : "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80"
                              }`}
                            >
                              {toTitleCase(topic)}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Standard Filters - Right Side */}
                      <div className="flex items-center gap-3">
                        <Select
                          value={difficultyFilter}
                          onValueChange={setDifficultyFilter}
                        >
                          <SelectTrigger className="w-28 h-8 bg-gray-800/80 border-0 text-white text-sm font-['Inter',_'system-ui',_sans-serif]">
                            <SelectValue placeholder="Difficulty" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={statusFilter}
                          onValueChange={setStatusFilter}
                        >
                          <SelectTrigger className="w-28 h-8 bg-gray-800/80 border-0 text-white text-sm font-['Inter',_'system-ui',_sans-serif]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="solved">Solved</SelectItem>
                            <SelectItem value="attempted">Attempted</SelectItem>
                            <SelectItem value="unattempted">
                              Not Attempted
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-28 h-8 bg-gray-800/80 border-0 text-white text-sm font-['Inter',_'system-ui',_sans-serif]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                            <SelectItem value="difficulty">
                              Difficulty
                            </SelectItem>
                            <SelectItem value="acceptance">
                              Acceptance
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Reset Filters Button */}
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              onClick={resetAllFilters}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-700/80"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Reset all filters</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-1 bg-gray-800/80 rounded-md p-1">
                          <Button
                            onClick={() => setViewModeAndSave("list")}
                            variant="ghost"
                            size="sm"
                            className={`h-6 w-6 p-0 ${
                              viewMode === "list"
                                ? "bg-purple-600 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-700"
                            }`}
                          >
                            <List className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setViewModeAndSave("card")}
                            variant="ghost"
                            size="sm"
                            className={`h-6 w-6 p-0 ${
                              viewMode === "card"
                                ? "bg-purple-600 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-700"
                            }`}
                          >
                            <Grid3X3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Problems Container with Header - Scrollable */}
              <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col min-h-0 overflow-hidden">
                {viewMode === "list" && (
                  <div className="bg-gray-900/40 border-gray-800/50 border rounded-t-lg px-4 py-2 text-sm font-medium text-gray-300 font-['Inter',_'system-ui',_sans-serif]">
                    <div className="flex items-center">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="w-4"></span> {/* Status icon space */}
                        <span className="w-12">#</span>
                        <span className="flex-1">Title</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="w-20">Difficulty</span>
                        <span className="w-16 text-right">Acceptance</span>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className={`flex-1 overflow-y-scroll ${
                    viewMode === "list"
                      ? "border-gray-800/50 border border-t-0 rounded-b-lg"
                      : ""
                  } bg-gray-900/20`}
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#4B5563 #1F2937",
                  }}
                >
                  {viewMode === "list" ? (
                    /* List View */
                    <div>
                      {filteredProblems.map((problem, index) => (
                        <div
                          key={problem._id}
                          className={`flex items-center p-3 transition-all duration-200 hover:bg-gray-800/60 cursor-pointer border-b border-gray-800/30 last:border-b-0 ${
                            index % 2 === 0
                              ? "bg-gray-800/20"
                              : "bg-gray-900/30"
                          }`}
                          onClick={() => handleSolveProblem(problem.titleSlug)}
                        >
                          <div className="flex items-center gap-3 flex-1">
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
                            <span className="text-sm font-medium text-gray-400 w-12 font-mono">
                              #{problem.problemNumber}
                            </span>
                            <span className="text-white font-medium flex-1 font-['Inter',_'system-ui',_sans-serif]">
                              {problem.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-20">
                              <Badge
                                className={`${getDifficultyColor(
                                  problem.difficulty
                                )} font-medium text-xs font-['Inter',_'system-ui',_sans-serif]`}
                              >
                                {problem.difficulty}
                              </Badge>
                            </div>
                            <span className="text-sm text-gray-400 w-16 text-right font-mono">
                              {calculateAcceptanceRate(
                                problem.successfulSubmissionCount,
                                problem.failedSubmissionCount
                              )}
                              %
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Card View */
                    <div className="space-y-0 p-4">
                      {filteredProblems.map((problem, index) => (
                        <Card
                          key={problem._id}
                          className={`border-gray-800/50 backdrop-blur-sm hover:bg-gray-900/80 transition-all duration-300 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 group mb-1 ${
                            index % 2 === 0
                              ? "bg-gray-800/20"
                              : "bg-gray-900/30"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                              {/* Left Section - Problem Info */}
                              <div className="flex-1 space-y-2">
                                {/* Title and Status */}
                                <div className="flex items-start gap-3">
                                  <div className="flex items-center gap-2 mt-1">
                                    <Tooltip>
                                      <TooltipTrigger>
                                        {getStatusIcon(
                                          problem.userProblemStatus
                                        )}
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {getStatusTooltip(
                                            problem.userProblemStatus
                                          )}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                    <span className="text-sm font-medium text-gray-400 font-mono">
                                      #{problem.problemNumber}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <h3
                                      className="text-lg font-semibold text-white hover:text-purple-400 transition-colors cursor-pointer group-hover:text-purple-300 font-['Inter',_'system-ui',_sans-serif]"
                                      onClick={() =>
                                        handleSolveProblem(problem.titleSlug)
                                      }
                                    >
                                      {problem.title}
                                    </h3>
                                  </div>
                                </div>

                                {/* Difficulty and Acceptance Rate */}
                                <div className="flex flex-wrap items-center gap-3">
                                  <Badge
                                    className={`${getDifficultyColor(
                                      problem.difficulty
                                    )} font-medium text-xs font-['Inter',_'system-ui',_sans-serif]`}
                                  >
                                    {problem.difficulty}
                                  </Badge>
                                  <div className="flex items-center gap-2 text-sm text-gray-400 font-['Inter',_'system-ui',_sans-serif]">
                                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                    <span>
                                      <span className="font-mono">
                                        {calculateAcceptanceRate(
                                          problem.successfulSubmissionCount,
                                          problem.failedSubmissionCount
                                        )}
                                        %
                                      </span>{" "}
                                      Acceptance
                                    </span>
                                  </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1">
                                  {problem.tags
                                    .slice(0, 4)
                                    .map((tag, tagIndex) => (
                                      <Badge
                                        key={tagIndex}
                                        variant="outline"
                                        className="text-xs border-0 bg-gray-800/60 text-gray-300 hover:bg-purple-500/20 hover:text-purple-400 transition-colors font-['Inter',_'system-ui',_sans-serif]"
                                      >
                                        {toTitleCase(tag)}
                                      </Badge>
                                    ))}
                                  {problem.tags.length > 4 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs border-0 bg-gray-800/60 text-gray-400 font-mono"
                                    >
                                      +{problem.tags.length - 4}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Right Section - Stats and Action */}
                              <div className="flex flex-col lg:items-end gap-3">
                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm">
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors">
                                        <ThumbsUp className="w-3 h-3" />
                                        <span className="font-mono">
                                          {problem.upvoteCount}
                                        </span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Upvotes</p>
                                    </TooltipContent>
                                  </Tooltip>

                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors">
                                        <ThumbsDown className="w-3 h-3" />
                                        <span className="font-mono">
                                          {problem.downvoteCount}
                                        </span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Downvotes</p>
                                    </TooltipContent>
                                  </Tooltip>

                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                                        <Users className="w-3 h-3" />
                                        <span className="font-mono">
                                          {problem.successfulSubmissionCount}
                                        </span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>People who solved this problem</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>

                                {/* Solve Button */}
                                <Button
                                  onClick={() =>
                                    handleSolveProblem(problem.titleSlug)
                                  }
                                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 text-sm font-['Inter',_'system-ui',_sans-serif]"
                                >
                                  Solve Problem
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Empty State */}
              {filteredProblems.length === 0 && problems.length > 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg font-['Inter',_'system-ui',_sans-serif]">
                    No problems match the current filters.
                  </div>
                  <Button
                    onClick={resetAllFilters}
                    variant="outline"
                    className="mt-4 border-purple-500 text-purple-400 hover:bg-purple-500/10 font-['Inter',_'system-ui',_sans-serif]"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {problems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg font-['Inter',_'system-ui',_sans-serif]">
                    No problems available at the moment. Please Login and try
                    again.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          .container::-webkit-scrollbar,
          div::-webkit-scrollbar {
            display: none;
          }
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </TooltipProvider>
  );
};

export default Problems;
