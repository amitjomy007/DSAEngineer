import React, { useEffect, useState } from "react";
import { Search, Grid3X3, List } from "lucide-react";
// import { Search, Filter, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import ProblemCard from "./ProblemCard";
import axios from "axios";
import type { ProblemFormData } from "../admin/AddEditProblemForm";
//above is interface of Problem

const ProblemListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const fetchedProblems = await axios.get(
          "http://localhost:8000/problems"
        );
        setProblems(fetchedProblems.data);
        console.log("")
      } catch (error) {
        console.log("Catched the Error: ", error);
      }
    };
    fetchProblems();
  }, []);
  // Mock data
  const [problems, setProblems] = useState<ProblemFormData[]>([]);
  // const Mockproblems = [
  //   {
  //     id: "1",
  //     title: "Two Sum",
  //     difficulty: "Easy" as const,
  //     acceptanceRate: 49.2,
  //     tags: ["Array", "Hash Table"],
  //     status: "solved" as const,
  //     isBookmarked: true,
  //     likes: 1240,
  //     submissions: 2500,
  //   },
  //   {
  //     id: "2",
  //     title: "Add Two Numbers",
  //     difficulty: "Medium" as const,
  //     acceptanceRate: 35.8,
  //     tags: ["Linked List", "Math", "Recursion"],
  //     status: "attempted" as const,
  //     isBookmarked: false,
  //     likes: 890,
  //     submissions: 1800,
  //   },
  //   {
  //     id: "3",
  //     title: "Longest Substring Without Repeating Characters",
  //     difficulty: "Medium" as const,
  //     acceptanceRate: 33.1,
  //     tags: ["Hash Table", "String", "Sliding Window"],
  //     status: "not-tried" as const,
  //     isBookmarked: true,
  //     likes: 1567,
  //     submissions: 3200,
  //   },
  //   {
  //     id: "4",
  //     title: "Median of Two Sorted Arrays",
  //     difficulty: "Hard" as const,
  //     acceptanceRate: 34.5,
  //     tags: ["Array", "Binary Search", "Divide and Conquer"],
  //     status: "not-tried" as const,
  //     isBookmarked: false,
  //     likes: 2134,
  //     submissions: 4100,
  //   },
  //   {
  //     id: "5",
  //     title: "Longest Palindromic Substring",
  //     difficulty: "Medium" as const,
  //     acceptanceRate: 32.4,
  //     tags: ["String", "Dynamic Programming"],
  //     status: "solved" as const,
  //     isBookmarked: true,
  //     likes: 1789,
  //     submissions: 2900,
  //   },
  //   {
  //     id: "6",
  //     title: "ZigZag Conversion",
  //     difficulty: "Medium" as const,
  //     acceptanceRate: 42.1,
  //     tags: ["String"],
  //     status: "attempted" as const,
  //     isBookmarked: false,
  //     likes: 567,
  //     submissions: 1200,
  //   },
  // ];
  // //setProblems(Mockproblems);
  // console.log(Mockproblems);

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.tags.some((tag) =>
        String(tag).toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesDifficulty =
      selectedDifficulty === "All" || problem.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
            Problem Set
          </h1>
          <p className="text-gray-400 text-lg">
            Sharpen your coding skills with our curated collection of problems
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search problems, tags, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-700/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            Showing {filteredProblems.length} of {problems.length} problems
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Sort by:</span>
            <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white">
              <option>Difficulty</option>
              <option>Acceptance Rate</option>
              <option>Most Recent</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>

        {/* Problems Grid/List */}
        {filteredProblems.length === 0 ? (
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              No problems found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredProblems.map((problem) => (
              <ProblemCard key={problem.id} {...problem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemListPage;
