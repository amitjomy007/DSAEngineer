import React, { useState, type JSX } from "react";
import axios from "axios";
import {
  Play,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// TypeScript interfaces
interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  acceptanceRate: string;
  tags: string[];
  solvedCount: number;
  stars: number;
  lastSolved: string;
  description: string;
  examples: Example[];
  constraints: string[];
}

interface Example {
  input: string;
  output: string;
  explanation: string;
}

interface TestCase {
  input: string;
  output: string;
  status: "passed" | "failed";
}

interface Language {
  value: string;
  label: string;
}

interface Verdict {
  status: "accepted" | "wrong" | "error" | "pending";
  title: string;
  message?: string;
  runtime?: number;
  memory?: number;
}

interface CodeTemplates {
  [key: string]: string;
}

// Mock data - replace with your database data
const mockProblemData: Problem = {
  id: 1,
  title: "Two Sum",
  difficulty: "Easy",
  acceptanceRate: "49.2%",
  tags: ["Array", "Hash Table"],
  solvedCount: 1240,
  stars: 2500,
  lastSolved: "2 days ago",
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
  ],
  constraints: [
    "2 ≤ nums.length ≤ 10⁴",
    "−10⁹ ≤ nums[i] ≤ 10⁹",
    "−10⁹ ≤ target ≤ 10⁹",
    "Only one valid answer exists.",
  ],
};

const mockTestCases: TestCase[] = [
  { input: "[2,7,11,15]\n9", output: "[0,1]", status: "passed" },
  { input: "[3,2,4]\n6", output: "[1,2]", status: "passed" },
  { input: "[3,3]\n6", output: "[0,1]", status: "failed" },
];

const languages: Language[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "go", label: "Go" },
];

const codeTemplates: CodeTemplates = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your code here
};`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here
        pass`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
    }
}`,
  cpp: `#include <iostream>
int main() {
    std::cout << "Hello from C++!";
    return 0;
}`,
  c: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize){
    // Your code here
}`,
  go: `func twoSum(nums []int, target int) []int {
    // Your code here
}`,
};

// Component Props Interfaces
interface ProblemHeaderProps {
  problem: Problem;
  showHeader: boolean;
}

interface ProblemDescriptionProps {
  problem: Problem;
  showDescription: boolean;
}

interface LanguageDropdownProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  showDropdown: boolean;
}

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  selectedLanguage: string;
  showEditor: boolean;
}

interface TestCasesProps {
  testCases: TestCase[];
  showTestCases: boolean;
}

interface RunButtonProps {
  onRun: () => void;
  isRunning: boolean;
  showRunButton: boolean;
}

interface VerdictProps {
  verdict: Verdict;
  showVerdict: boolean;
}

// Problem Header Component
const ProblemHeader: React.FC<ProblemHeaderProps> = ({
  problem,
  showHeader,
}) => {
  if (!showHeader) return null;

  return (
    <div className="bg-gray-900 border-b border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">
            {problem.id}. {problem.title}
          </h1>
          <span
            className={`px-2 py-1 rounded text-sm font-medium ${
              problem.difficulty === "Easy"
                ? "bg-green-900 text-green-300"
                : problem.difficulty === "Medium"
                ? "bg-yellow-900 text-yellow-300"
                : "bg-red-900 text-red-300"
            }`}
          >
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>{problem.acceptanceRate} accepted</span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{problem.stars}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          {problem.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-900 text-blue-300 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>{problem.solvedCount} solved</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{problem.lastSolved}</span>
        </div>
      </div>
    </div>
  );
};

// Problem Description Component
const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  problem,
  showDescription,
}) => {
  if (!showDescription) return null;

  return (
    <div className="bg-gray-800 p-6 border-b border-gray-700 rounded-lg">
      <div className="prose max-w-none">
        <p className="text-gray-300 whitespace-pre-line mb-6">
          {problem.description}
        </p>

        <div className="space-y-4">
          {problem.examples.map((example, index) => (
            <div
              key={index}
              className="bg-gray-900 p-4 rounded-lg border border-gray-700"
            >
              <h4 className="font-semibold text-white mb-2">
                Example {index + 1}:
              </h4>
              <div className="space-y-1 text-sm">
                <div className="text-gray-300">
                  <strong className="text-blue-400">Input:</strong>{" "}
                  {example.input}
                </div>
                <div className="text-gray-300">
                  <strong className="text-green-400">Output:</strong>{" "}
                  {example.output}
                </div>
                <div className="text-gray-300">
                  <strong className="text-yellow-400">Explanation:</strong>{" "}
                  {example.explanation}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-white mb-2">Constraints:</h4>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            {problem.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Language Dropdown Component
const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  selectedLanguage,
  onLanguageChange,
  showDropdown,
}) => {
  if (!showDropdown) return null;

  return (
    <div className="flex items-center space-x-2 mb-4">
      <label className="text-sm font-medium text-gray-300">Language:</label>
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Code Editor Component
const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onCodeChange,
  selectedLanguage,
  showEditor,
}) => {
  if (!showEditor) return null;

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      <div className="bg-gray-800 px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
        Code Editor -{" "}
        {languages.find((l) => l.value === selectedLanguage)?.label}
      </div>
      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        className="w-full h-80 bg-gray-900 text-green-400 font-mono text-sm p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your code here..."
        spellCheck={false}
      />
    </div>
  );
};

// Test Cases Component
const TestCases: React.FC<TestCasesProps> = ({ testCases, showTestCases }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  if (!showTestCases) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg">
      <div className="border-b border-gray-700">
        <div className="flex space-x-4 px-4 py-2">
          {testCases.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                activeTab === index
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              Case {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Input:
            </label>
            <pre className="bg-gray-900 p-2 rounded text-sm text-green-400 border border-gray-700">
              {testCases[activeTab].input}
            </pre>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Expected Output:
            </label>
            <pre className="bg-gray-900 p-2 rounded text-sm text-green-400 border border-gray-700">
              {testCases[activeTab].output}
            </pre>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-300">Status:</span>
            {testCases[activeTab].status === "passed" ? (
              <div className="flex items-center space-x-1 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Passed</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-400">
                <XCircle className="w-4 h-4" />
                <span className="text-sm">Failed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Run Button Component
const RunButton: React.FC<RunButtonProps> = ({
  onRun,
  isRunning,
  showRunButton,
}) => {
  if (!showRunButton) return null;

  return (
    <button
      onClick={onRun}
      disabled={isRunning}
      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
    >
      <Play className="w-4 h-4" />
      <span>{isRunning ? "Running..." : "Run Code"}</span>
    </button>
  );
};

// Verdict Component
const Verdict: React.FC<VerdictProps> = ({ verdict, showVerdict }) => {
  if (!showVerdict) return null;

  const getVerdictColor = (): string => {
    switch (verdict.status) {
      case "accepted":
        return "text-green-400 bg-green-900 bg-opacity-50 border-green-600";
      case "wrong":
        return "text-red-400 bg-red-900 bg-opacity-50 border-red-600";
      case "error":
        return "text-yellow-400 bg-yellow-900 bg-opacity-50 border-yellow-600";
      default:
        return "text-gray-400 bg-gray-800 border-gray-600";
    }
  };

  const getVerdictIcon = (): JSX.Element => {
    switch (verdict.status) {
      case "accepted":
        return <CheckCircle className="w-5 h-5" />;
      case "wrong":
        return <XCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getVerdictColor()}`}>
      <div className="flex items-center space-x-2 mb-2">
        {getVerdictIcon()}
        <span className="font-semibold">{verdict.title}</span>
      </div>
      {verdict.message && (
        <p className="text-sm opacity-90">{verdict.message}</p>
      )}
      {verdict.runtime && (
        <div className="mt-2 text-sm opacity-80">
          <span>Runtime: {verdict.runtime}ms</span>
          {verdict.memory && (
            <span className="ml-4">Memory: {verdict.memory}MB</span>
          )}
        </div>
      )}
    </div>
  );
};

// Main Component
const ProblemSolver: React.FC = () => {
  // State variables with default values
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>("javascript");
  const [code, setCode] = useState<string>(codeTemplates.javascript);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [verdict, setVerdict] = useState<Verdict>({
    status: "accepted",
    title: "Accepted",
    message: "Your solution passed all test cases!",
    runtime: 64,
    memory: 42.1,
  });

  // Conditional rendering flags - set these based on your database/state
  const [showVerdict, setShowVerdict] = useState<boolean>(true);
  // const [showHeader, setShowHeader] = useState<boolean>(true);
  // const [showDescription, setShowDescription] = useState<boolean>(true);
  // const [showDropdown, setShowDropdown] = useState<boolean>(true);
  // const [showEditor, setShowEditor] = useState<boolean>(true);
  // const [showTestCases, setShowTestCases] = useState<boolean>(true);
  // const [showRunButton, setShowRunButton] = useState<boolean>(true);
  //since the setState above are not used and causing error, i'm making the below codes
  const showHeader: boolean = true;
  const showDescription: boolean = true;
  const showDropdown: boolean = true;
  const showEditor: boolean = true;
  const showTestCases: boolean = true;
  const showRunButton: boolean = true;

  const handleLanguageChange = (language: string): void => {
    setSelectedLanguage(language);
    setCode(codeTemplates[language]);
  };

  const handleRunCode = async (
    language: string,
    code: string
  ): Promise<void> => {
    setIsRunning(true);
    // Simulate API call
    // const [output, setOutput] = useState(undefined);
    try {
      const payload = { language, code };
      let response = undefined;
      console.log("Going to send payload to compiler backend");
      response = await axios.post("http://localhost:8000/judge", payload);
      // setOutput(response);
      console.log("Output from backend: ", response);
      console.log("Output from backend.data :  ", response.data);
    } catch (error) {
      console.log("Catched the Error: ", error);
    }
    setTimeout(() => {
      setIsRunning(false);
      setVerdict({
        status: "accepted",
        title: "Accepted",
        message: "Your solution passed all test cases!",
        runtime: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 50) + 20,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Problem Header */}
      <ProblemHeader problem={mockProblemData} showHeader={showHeader} />

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Problem Description */}
          <div className="space-y-6">
            <ProblemDescription
              problem={mockProblemData}
              showDescription={showDescription}
            />

            {/* Test Cases */}
            <TestCases
              testCases={mockTestCases}
              showTestCases={showTestCases}
            />
          </div>

          {/* Right Panel - Code Editor */}
          <div className="space-y-4">
            {/* Language Selection */}
            <LanguageDropdown
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              showDropdown={showDropdown}
            />

            {/* Code Editor */}
            <CodeEditor
              code={code}
              onCodeChange={setCode}
              selectedLanguage={selectedLanguage}
              showEditor={showEditor}
            />

            {/* Run Button */}
            <div className="flex justify-between items-center">
              <RunButton
                onRun={() => handleRunCode(selectedLanguage, code)}
                isRunning={isRunning}
                showRunButton={showRunButton}
              />

              {/* Toggle buttons for demo purposes */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowVerdict(!showVerdict)}
                  className="text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 px-2 py-1 rounded transition-colors"
                >
                  Toggle Verdict
                </button>
              </div>
            </div>

            {/* Verdict */}
            <Verdict verdict={verdict} showVerdict={showVerdict} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolver;
