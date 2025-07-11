import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
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
} from "lucide-react";
import Editor from "@monaco-editor/react";

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
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
};

// Simple syntax highlighting function
//commented out since its not used
// const highlightCode = (code: string, language: string) => {
//   const keywords = {
//     javascript: ['function', 'var', 'let', 'const', 'return', 'if', 'else', 'for', 'while', 'class'],
//     python: ['def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'import', 'from'],
//     java: ['public', 'private', 'class', 'return', 'if', 'else', 'for', 'while', 'int', 'String'],
//     cpp: ['public', 'private', 'class', 'return', 'if', 'else', 'for', 'while', 'int', 'vector']
//   };

//   let highlighted = code;

//   // Highlight keywords
//   keywords[language as keyof typeof keywords]?.forEach(keyword => {
//     const regex = new RegExp(`\\b${keyword}\\b`, 'g');
//     highlighted = highlighted.replace(regex, `<span style="color: #569cd6;">${keyword}</span>`);
//   });

//   // Highlight strings
//   highlighted = highlighted.replace(/"([^"]*)"/g, '<span style="color: #ce9178;">"$1"</span>');
//   highlighted = highlighted.replace(/'([^']*)'/g, '<span style="color: #ce9178;">\'$1\'</span>');

//   // Highlight comments
//   highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span style="color: #6a9955;">$&</span>');
//   highlighted = highlighted.replace(/\/\/.*$/gm, '<span style="color: #6a9955;">$&</span>');
//   highlighted = highlighted.replace(/#.*$/gm, '<span style="color: #6a9955;">$&</span>');

//   // Highlight numbers
//   highlighted = highlighted.replace(/\b\d+\b/g, '<span style="color: #b5cea8;">$&</span>');

//   return highlighted;
// };

const SolveProblemPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<ISolveProblem | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(codeTemplates.javascript);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fetchProblemData = async () => {
    // This will be replaced with actual API call
    try {
      const uId = Cookies.get("userId");
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
    setCode(codeTemplates[language as keyof typeof codeTemplates]);
  };

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
  };

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
      const userId = Cookies.get("userId");
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
        Cookies.get("userId")
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/problems"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-xl font-semibold">
                {problem.problemNumber}. {problem.title}
              </span>
              <span
                className={`text-lg font-bold px-4 py-2 rounded-lg border-2 ${
                  problem.difficulty === "Easy"
                    ? "text-green-400 border-green-400 bg-green-400/10"
                    : problem.difficulty === "Medium"
                    ? "text-yellow-400 border-yellow-400 bg-yellow-400/10"
                    : "text-red-400 border-red-400 bg-red-400/10"
                }`}
              >
                {problem.difficulty}
              </span>
            </div>
          </div>

          {/* Stats Section - More Prominent */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-green-600/20 px-4 py-2 rounded-lg">
              <ThumbsUp size={20} className="text-green-400" />
              <span className="text-lg font-semibold text-green-400">
                {problem.upvoteCount}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-red-600/20 px-4 py-2 rounded-lg">
              <ThumbsDown size={20} className="text-red-400" />
              <span className="text-lg font-semibold text-red-400">
                {problem.downvoteCount}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-600/20 px-4 py-2 rounded-lg">
              <Users size={20} className="text-blue-400" />
              <span className="text-lg font-semibold text-blue-400">
                {problem.successfulSubmissionCount}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-purple-600/20 px-4 py-2 rounded-lg">
              <span className="text-lg font-semibold text-purple-400">
                {calculateAcceptanceRate()}%
              </span>
              <span className="text-sm text-purple-300">Acceptance</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - More Prominent */}
        <div className="px-6 pb-4">
          <div className="flex space-x-2">
            <div className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium">
              <Code size={16} className="inline mr-2" />
              Problem
            </div>
            <Link
              to={`/problems/${slug}/editorial`}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors font-medium"
            >
              <BookOpen size={16} className="inline mr-2" />
              Editorial
            </Link>
            <Link
              to={`/problems/${slug}/comments`}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors font-medium"
            >
              <MessageSquare size={16} className="inline mr-2" />
              Comments
            </Link>
            <Link
              to={`/problems/${slug}/submissions`}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors font-medium"
            >
              <FileText size={16} className="inline mr-2" />
              Submissions
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-gray-700 overflow-y-auto">
          <div className="p-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                {problem.description}
              </p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Examples
                </h3>
                {problem.examples.map((example, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <div className="mb-2">
                      <strong className="text-sm text-gray-400">Input:</strong>
                      <code className="ml-2 text-sm bg-gray-700 px-2 py-1 rounded text-green-300">
                        {example.input}
                      </code>
                    </div>
                    <div className="mb-2">
                      <strong className="text-sm text-gray-400">Output:</strong>
                      <code className="ml-2 text-sm bg-gray-700 px-2 py-1 rounded text-blue-300">
                        {example.output}
                      </code>
                    </div>
                    {example.explanation && (
                      <div>
                        <strong className="text-sm text-gray-400">
                          Explanation:
                        </strong>
                        <span className="ml-2 text-sm text-gray-300">
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
                    <li key={index} className="text-sm">
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
                        className="bg-gray-800/30 rounded-lg p-3 border border-gray-700"
                      >
                        <summary className="cursor-pointer text-sm font-medium text-purple-300 hover:text-purple-200">
                          Hint {index + 1}
                        </summary>
                        <p className="mt-2 text-sm text-gray-300">{hint}</p>
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
                        className="px-3 py-1 text-sm bg-purple-600/20 text-purple-300 rounded-full border border-purple-600/30"
                      >
                        {capitalizeTag(tag)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-yellow-400" />
                    <span>
                      Time Limit:{" "}
                      <strong className="text-yellow-400">
                        {problem.timeLimit}s
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MemoryStick size={16} className="text-blue-400" />
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
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Language Selector */}
          <div className="border-b border-gray-700 p-4 bg-gray-800/30">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {problem.allowedLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                      selectedLanguage === lang
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Monaco Code Editor */}
          <div className="flex-1 p-4">
            <div className="h-full rounded-lg overflow-hidden border border-gray-700">
              <Editor
                height="100%"
                language={selectedLanguage === "cpp" ? "cpp" : selectedLanguage}
                value={code}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  insertSpaces: true,
                  wordWrap: "on",
                  lineNumbers: "on",
                  glyphMargin: false,
                  folding: false,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                  renderLineHighlight: "line",
                  selectOnLineNumbers: true,
                  roundedSelection: false,
                  readOnly: false,
                  cursorStyle: "line",
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-700 p-4 bg-gray-800/30">
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
                >
                  {isRunning ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Play size={16} />
                  )}
                  <span>{isRunning ? "Running..." : "Run Code"}</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Test Results Area */}
          <div className="border-t border-gray-700 p-4 bg-gray-800/30 min-h-[120px]">
            <h4 className="text-lg font-semibold mb-3 text-white">
              Test Results
            </h4>
            <div className="text-sm text-gray-400">
              {isRunning
                ? "Running your code..."
                : "Run your code to see test results here..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolveProblemPage;
