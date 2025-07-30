import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useDebounce from "../../lib/useDebounceHook";
import SubmissionsListTabComponent from "../../components/tabs/submissionsTab";
import {
  updateCode,
  updateLanguage,
  setProblemData,
} from "../../store/aiChatSlice";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  Play,
  Upload,
  ThumbsUp,
  ThumbsDown,
  Clock,
  MemoryStick,
  Users,
  MessageSquare,
  BookOpen,
  Code,
  FileText,
  Loader2,
  TrendingUp,
  MessageCircleCode,
  Lightbulb,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import ChatWindow from "../../components/chat/chatWindow";
import EditorialTabComponent from "../../components/tabs/editorialTab";
import CommentsSection from "../../components/tabs/commentTab";
import StopwatchTimer from "../../components/solveProblem/timerComponent";
import UserMenu from "../../components/layout/navbarProfileButton";




// Interface for the problem data
interface ISolveProblem {
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
  examples: {
    input: string;
    output: string;
    explanation?: string;
    _id?: string;
  }[];
  constraints: string[];
  hints: string[];
  testcases: {
    input: string;
    output: string;
    _id?: string;
  }[];
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

// Code templates for different languages
const codeTemplates = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout<<"hello world";
    return 0;
}
`,
};

const SolveProblemPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"problem" | "editorial" | "comments" | "submissions">("problem");
  const [activeTabRight, setActiveTabRight] = useState<"chat" | "editor">("editor");
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<ISolveProblem | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [code, setCode] = useState(codeTemplates.cpp);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const debouncedCode = useDebounce(code, 500); // 500ms delay
  const debouncedLanguage = useDebounce(selectedLanguage, 500);
  // Mock data for development
  const mockProblem: ISolveProblem = {
    _id: "686682cecd48d8b19847c954",
    id: 101,
    isApproved: true,
    problemAuthorId: "64a51b0c2fba4b2e149de799",
    problemCreatedDate: "2025-07-02T10:00:00.000Z",
    problemLastModifiedDate: "2025-07-02T12:00:00.000Z",
    problemNumber: 101,
    title: "Two Sum",
    titleSlug: "two-sum",
    difficulty: "Easy",
    tags: ["array", "hash-table"],
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6.",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    hints: [
      "Use a hash map to store seen numbers and their indices.",
      "Check if target - current number is in the map.",
    ],
    testcases: [
      { input: "[2,7,11,15],9", output: "[0,1]" },
      { input: "[3,2,4],6", output: "[1,2]" },
    ],
    timeLimit: 1,
    memoryLimit: 128,
    allowedLanguages: ["javascript", "python", "java", "cpp"],
    editorialId: "64a520f19b2485e1449de800",
    successfulSubmissionCount: 1247,
    failedSubmissionCount: 423,
    upvoteCount: 1854,
    downvoteCount: 127,
    userProblemStatus: "unattempted",
    userVoteStatus: "none",
  };
  useEffect(() => {
    dispatch(updateCode(debouncedCode));
  }, [debouncedCode, dispatch]);

  useEffect(() => {
    dispatch(updateLanguage(debouncedLanguage));
  }, [debouncedLanguage, dispatch]);

  useEffect(() => {
    if (problem) {
      dispatch(
        setProblemData({
          title: problem.title,
          description: problem.description,
          examples: problem.examples,
        })
      );
    }
  }, [problem, dispatch]);

  const fetchProblemData = async () => {
    // This will be replaced with actual API call
    try {
      const uId = Cookies.get("userId31d6cfe0d16ae931b73c59d7e0c089c0");
      console.log("slug before sending: ", slug);
      const response = await axios.get(
        `http://localhost:8000/getProblem/${slug}`,
        {
          headers: {
            "user-id": uId,
          },
        }
      );
      console.log("received response from server was : ", response);
      // console.log("Received data from server: ", response.data.problem);
      console.log("mock problem : ", mockProblem);
      setProblem(response.data.problem);
    } catch (err) {
      console.log("Received error when trying to fetch problem data: ", err);
    }

    // setProblem(response.data.problem);
  };

  useEffect(() => {
    fetchProblemData();
  }, [slug]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    setCode(codeTemplates[language as keyof typeof codeTemplates]);
  };

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
  };
  const ToggleActiveTabRight = () => {
    if (activeTabRight == 'chat') {
      setActiveTabRight('editor');
    }
    else {
      setActiveTabRight('chat');
    }
  }

  const handleRunCode = async () => {
    setIsRunning(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRunning(false);
    console.log("Code executed");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    try {
      const userId = Cookies.get("userId31d6cfe0d16ae931b73c59d7e0c089c0");
      if (!userId) {
        navigate('/login')
      }
      const payload = {
        problemId: problem?._id,
        code: code,
        language: selectedLanguage,
        userId: userId,
      };
      const response = await axios.post("http://localhost:8000/judge", payload);
      console.log(
        "Submitted payload : ",
        problem?._id,
        code,
        selectedLanguage,
        Cookies.get("userId31d6cfe0d16ae931b73c59d7e0c089c0")
      );
      console.log(response);
      navigate(`/problems/${slug}/submission`);
      console.log(
        "Final Verdict and Status : ",
        response.data.verdict,
        response.data.responseFromCompiler.status
      );
    } catch (err) {
      console.log("failed to submit code: ", err);
    }
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsSubmitting(false);
    console.log("Code submitted");
  };

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!problem) return;
    setVoteLoading(true);
    try {
      let userId = Cookies.get("userId31d6cfe0d16ae931b73c59d7e0c089c0");
      if (!userId) return;
      userId = userId.replace(/^"+|"+$/g, "");

      const payload = {
        userId,
        problemId: problem._id,
        voteType,
      };
      const response = await axios.post(
        "http://localhost:8000/voteProblem",
        payload
      );
      // Update local state based on response
      setProblem((prev) =>
        prev
          ? {
            ...prev,
            upvoteCount: response.data.upvoteCount,
            downvoteCount: response.data.downvoteCount,
            userVoteStatus: voteType === "upvote" ? "upvoted" : "downvoted",
          }
          : prev
      );
    } catch (err) {
      console.log("Vote failed:", err);
    }
    setVoteLoading(false);
  };

  //   const getDifficultyColor = (difficulty: string) => {
  //     switch (difficulty) {
  //       case 'Easy': return 'text-green-400';
  //       case 'Medium': return 'text-yellow-400';
  //       case 'Hard': return 'text-red-400';
  //       default: return 'text-gray-400';
  //     }
  //   };

  const calculateAcceptanceRate = () => {
    if (problem?.successfulSubmissionCount) {
      const total =
        problem?.successfulSubmissionCount + problem?.failedSubmissionCount;
      if (total === 0) return 0;
      return Math.round((problem?.successfulSubmissionCount / total) * 100);
    }
  };

  const capitalizeTag = (tag: string) => {
    return tag.charAt(0).toUpperCase() + tag.slice(1);
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  const getTabClassName = (tabName: string) => {
    return `w-full h-10 flex items-center px-4 py-2 rounded-none font-medium transition-colors ${activeTab === tabName
      ? 'bg-purple-600 text-white'
      : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
      }`;
  };
  const getTabClassNameRight = (tabName: string) => {
    return `w-full h-10  flex items-center px-4 py-2  rounded-none font-medium transition-colors ${tabName === 'editor'
      ? 'bg-amber-300 text-gray-950 shadow-sm shadow-amber-300'
      : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
      }`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 h-18 z-50 w-full  bg-gray-950/30 backdrop-blur-md">
        <div className="flex items-center justify-between px-8 pl-2 py-4">
          <div className="flex items-center space-x-2">
            <Link
              to="/problems"
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800/50"
            >
              <ChevronLeft size={20} />
            </Link>
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-white truncate">
                {problem.problemNumber}. {problem.title}
              </h1>
              <div
                className={`inline-flex items-center px-5 py-1 rounded-full text-sm font-mono whitespace-nowrap ${problem.difficulty === "Easy"
                  ? "text-emerald-300 bg-emerald-500/10 border border-emerald-500/20"
                  : problem.difficulty === "Medium"
                    ? "text-amber-300 bg-amber-500/10 border border-amber-500/20"
                    : "text-rose-300 bg-rose-500/10 border border-rose-500/20"
                  }`}
              >
                {problem.difficulty}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <StopwatchTimer />

            <div className="flex items-center space-x-4">
              <button
                disabled={voteLoading}
                onClick={() => handleVote("upvote")}
                className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${problem.userVoteStatus === "upvoted"
                  ? "text-green-400 hover:text-green-300"
                  : "text-gray-400 hover:text-green-400"
                  }`}
              >
                <ThumbsUp size={16} />
                <span className="text-sm">{problem.upvoteCount}</span>
              </button>

              <button
                disabled={voteLoading}
                onClick={() => handleVote("downvote")}
                className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${problem.userVoteStatus === "downvoted"
                  ? "text-red-400 hover:text-red-300"
                  : "text-gray-400 hover:text-red-400"
                  }`}
              >
                <ThumbsDown size={16} />
                <span className="text-sm">{problem.downvoteCount}</span>
              </button>
              <UserMenu/>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="relative group">
                <div className="flex items-center space-x-1 text-slate-300 cursor-default">
                  <Users size={16} className="text-blue-400" />
                  <span className="font-medium">{problem.successfulSubmissionCount}</span>
                </div>
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700">
                  Submissions
                </div>
              </div>
              <div className="relative group">
                <div className="flex items-center space-x-1 text-slate-300 cursor-default">
                  <TrendingUp size={18} className="text-purple-400" />
                  <span className="font-medium text-purple-400">{calculateAcceptanceRate()}%</span>
                </div>
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700">
                  Accepted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Account for fixed header */}
      <div className="flex w-full overflow-hidden" style={{ height: 'calc(100vh - 72px)', marginTop: '72px' }}>
        {/* Left Panel - Problem Description (Scrollable) */}
        <div className="w-1/2 border-r border-gray-700 flex flex-col overflow-hidden">
          {/* Navigation Tabs - Fixed */}
          <div className="flex-shrink-0 w-full border-b border-gray-700">
            <div className="grid grid-cols-4 min-w-0">
              <button
                onClick={() => setActiveTab("problem")}
                className={getTabClassName("problem")}
              >
                <Code size={16} className="inline mr-0 flex-shrink-0" />
                <span className="truncate w-full justify-center">Problem</span>
              </button>
              <button
                onClick={() => setActiveTab("editorial")}
                className={getTabClassName("editorial")}
              >
                <BookOpen size={16} className="inline mr-0 flex-shrink-0" />
                <span className="truncate w-full justify-center">Editorial</span>
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={getTabClassName("comments")}
              >
                <MessageSquare size={16} className="inline mr-0 flex-shrink-0" />
                <span className="truncate w-full justify-center">Comments</span>
              </button>
              <button
                onClick={() => setActiveTab("submissions")}
                className={getTabClassName("submissions")}
              >
                <FileText size={16} className="inline mr-0 flex-shrink-0" />
                <span className="truncate w-full justify-center">Submissions</span>
              </button>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="p-5">
              {activeTab === 'problem' && (
                <div className="prose prose-invert max-w-none">
                  <h1 className="text-2xl font-semibold mb-4">
                    Problem Description
                  </h1>
                  <p className="text-gray-300 leading-relaxed mb-6 text-lg break-words">
                    {problem.description}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-white">
                      Examples
                    </h3>
                    {problem.examples.map((example, index) => (
                      <div
                        key={index}
                        className="mb-4 p-4 bg-gray-800/50 rounded-sm border border-gray-700"
                      >
                        <div className="mb-2">
                          <strong className="text-sm text-gray-400">Input:</strong>
                          <code className="ml-2 text-sm bg-gray-700 px-2 py-1 rounded text-green-300 break-all word-wrap">
                            {example.input}
                          </code>
                        </div>
                        <div className="mb-2">
                          <strong className="text-sm text-gray-400">Output:</strong>
                          <code className="ml-2 text-sm bg-gray-700 px-2 py-1 rounded text-blue-300 break-all word-wrap">
                            {example.output}
                          </code>
                        </div>
                        {example.explanation && (
                          <div>
                            <strong className="text-sm text-gray-400">
                              Explanation:
                            </strong>
                            <span className="ml-2 text-sm text-gray-300 break-words">
                              {example.explanation}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-white">
                      Constraints
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      {problem.constraints.map((constraint, index) => (
                        <li key={index} className="text-sm break-words">
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {problem.hints.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-4 text-white">
                        Hints
                      </h3>
                      <div className="space-y-2">
                        {problem.hints.map((hint, index) => (
                          <details
                            key={index}
                            className="bg-gray-800/30 rounded-sm p-3 border border-gray-700"
                          >
                            <summary className="cursor-pointer text-sm font-medium text-purple-300 hover:text-purple-200">
                              Hint {index + 1}
                            </summary>
                            <p className="mt-2 text-sm text-gray-300 break-words">{hint}</p>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Topics, Tags and Limits at Bottom */}
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-white">
                        Topics
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {problem.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm bg-purple-600/20 text-purple-300 rounded-full border border-purple-600/30 whitespace-nowrap"
                          >
                            {capitalizeTag(tag)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-2 whitespace-nowrap">
                        <Clock size={16} className="text-yellow-400 flex-shrink-0" />
                        <span>
                          Time Limit:{" "}
                          <strong className="text-yellow-400">
                            {problem.timeLimit}s
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 whitespace-nowrap">
                        <MemoryStick size={16} className="text-blue-400 flex-shrink-0" />
                        <span>
                          Memory Limit:{" "}
                          <strong className="text-blue-400">
                            {problem.memoryLimit}MB
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'submissions' && <SubmissionsListTabComponent />}
              {activeTab === 'editorial' && <EditorialTabComponent />}
              {activeTab === 'comments' && <CommentsSection />}
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor (Non-scrollable) */}
        <div className="w-1/2 h-full flex flex-col overflow-hidden">
          {/* Language Selector and Action Buttons - Fixed */}
          <div className="flex-shrink-0 flex items-center h-10  justify-between  bg-gray-900">
            {/* Language Selector */}
            <div className="flex flex-row items-center px-0 py-0">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-10 flex items-center justify-between px-3 pl-4 text-sm font-mono text-white hover:bg-gray-800 transition-colors min-w-0"
                  >
                    <span className="font-mono truncate mr-2">
                      {selectedLanguage === 'cpp'
                        ? 'C++'
                        : selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)
                      }
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 ml-2 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-gray-900 border border-gray-600 shadow-lg z-20">
                      {problem.allowedLanguages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => handleLanguageChange(lang)}
                          className={`w-full px-3 py-1.5 text-xs text-left hover:bg-gray-800 transition-colors ${selectedLanguage === lang
                            ? "bg-gray-800 text-white"
                            : "text-gray-300"
                            }`}
                        >
                          {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Click outside to close */}
              {isOpen && (
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                />
              )}
              <button
                onClick={() => ToggleActiveTabRight()}
                className={getTabClassNameRight(activeTabRight)}
              >

                {/* <MessageCircleCode  size={16} className="inline mr-2 flex-shrink-0" /> */}
                <Lightbulb size={16} className="inline mr-2 flex-shrink-0" />
                <span className="truncate">{activeTabRight == 'chat' ? 'TestCase' : 'AI CHAT'}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="px-0 py-0 h-full">
              <div className="flex space-x-0 h-full  ">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex  w-28 items-center justify-center space-x-1.5 px-4 py-0 text-xs bg-gray-800 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors font-medium "
                >
                  {isRunning ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Play size={12} />
                  )}
                  <span className="whitespace-nowrap">{isRunning ? "Running..." : "Run"}</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex w-28 items-center justify-center space-x-1.5 px-4 py-2 text-xs bg-green-700 hover:bg-green-600 disabled:bg-green-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSubmitting ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Upload size={12} />
                  )}
                  <span className="whitespace-nowrap">{isSubmitting ? "Submitting..." : "Submit"}</span>
                </button>
              </div>
            </div>
          </div>


          {/* Monaco Code Editor */}

          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-hidden">
              <Editor
                height="100%"
                language={selectedLanguage === "cpp" ? "cpp" : selectedLanguage}
                value={code}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  fontSize: 15,
                  fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  insertSpaces: true,
                  wordWrap: "on",
                  lineNumbers: "on",
                  glyphMargin: false,
                  folding: true,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                  renderLineHighlight: "line",
                  selectOnLineNumbers: true,
                  roundedSelection: false,
                  readOnly: false,
                  cursorStyle: "line",
                  padding: {
                    top: 10,
                  },
                  scrollbar: {
                    vertical: 'visible',
                    horizontal: 'visible',
                    verticalScrollbarSize: 12,
                    horizontalScrollbarSize: 12,
                  }
                }}
              />
            </div>
          </div>

          {/* Test Results Area + AI CHAT - Fixed at bottom */}
          {activeTabRight == 'chat' && <ChatWindow />}
          {activeTabRight == 'editor' &&
            <div className="max-h-full flex-shrink-0 border-t border-gray-700 p-4 bg-gray-800/30 h-64 overflow-hidden">
              <h4 className="text-lg font-semibold mb-3 text-white">
                Test Results
              </h4>
              <div className="text-sm text-gray-400 overflow-y-auto h-16">
                {isRunning
                  ? "Running your code... (Fake simulation ⚠️)"
                  : "Testcase running under development ⚠️"}
              </div>
              <div>Meanwhile checkout the AI Chat Feature</div>
          
            </div>
          }
        </div>

      </div>
    </div>
  );

};

export default SolveProblemPage;
