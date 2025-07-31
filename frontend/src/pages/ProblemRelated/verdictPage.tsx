import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Code,
  Calendar,
  Timer,
  MemoryStick,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import Editor from "@monaco-editor/react";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "3000";
console.log("backendUrl:", backendUrl);
// Interface for submission data
interface ISubmission {
  _id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: string;
  verdict:
    | "Accepted"
    | "Wrong Answer"
    | "Time Limit Exceeded"
    | "Compilation Error"
    | "Runtime Error";
  totalTestCases?: number;
  passedTestCases?: number;
  runtimeMs?: number;
  memoryKb?: number;
  failedTestCase?: {
    input: string;
    output: string;
    expectedOutput: string;
  };
  createdAt: string;
}

// Component for animated counter
const AnimatedCounter = ({
  start,
  end,
  duration = 1500,
  suffix = "",
  prefix = "",
  className = "",
}: {
  start: number;
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) => {
  const [current, setCurrent] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const startTime = Date.now();
    const difference = end - start;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newValue = Math.floor(start + difference * easeOut);

      setCurrent(newValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [start, end, duration]);

  return (
    <span className={`${className} ${isAnimating ? "animate-pulse" : ""}`}>
      {prefix}
      {current}
      {suffix}
    </span>
  );
};

const SubmissionResult = () => {
  const { slug, submissionId } = useParams<{
    slug: string;
    submissionId: string;
  }>();

  console.log("problem slug and submission id: ", slug, submissionId);
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<ISubmission | null>(null);
  const [allSubmissions, setAllSubmissions] = useState<ISubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCode, setShowCode] = useState(false);

  // Mock data for current submission
  //   const mockSubmission: ISubmission = {
  //     _id: submissionId || "12345",
  //     userId: "user123",
  //     problemId: "101",
  //     code: `class Solution {
  //     public int[] twoSum(int[] nums, int target) {
  //         HashMap<Integer, Integer> map = new HashMap<>();
  //         for (int i = 0; i < nums.length; i++) {
  //             int complement = target - nums[i];
  //             if (map.containsKey(complement)) {
  //                 return new int[] { map.get(complement), i };
  //             }
  //             map.put(nums[i], i);
  //         }
  //         return new int[0];
  //     }
  // }`,
  //     language: "java",
  //     status: "Accepted",
  //     verdict: "Accepted",
  //     totalTestCases: 10,
  //     passedTestCases: 10,
  //     runtimeMs: 2,
  //     memoryKb: 45600,
  //     createdAt: "2025-07-11T14:30:00.000Z",
  //   };

  //   // Mock data for all user submissions for this problem
  //   const mockAllSubmissions: ISubmission[] = [
  //     {
  //       _id: "12345",
  //       userId: "user123",
  //       problemId: "101",
  //       code: "// Latest submission code",
  //       language: "java",
  //       status: "Accepted",
  //       verdict: "Accepted",
  //       totalTestCases: 10,
  //       passedTestCases: 10,
  //       runtimeMs: 2,
  //       memoryKb: 45600,
  //       createdAt: "2025-07-11T14:30:00.000Z",
  //     },
  //     {
  //       _id: "12344",
  //       userId: "user123",
  //       problemId: "101",
  //       code: "// Previous wrong answer code",
  //       language: "java",
  //       status: "Wrong Answer",
  //       verdict: "Wrong Answer",
  //       totalTestCases: 10,
  //       passedTestCases: 7,
  //       failedTestCase: {
  //         input: "[3,3],6",
  //         output: "[0,0]",
  //         expectedOutput: "[0,1]",
  //       },
  //       createdAt: "2025-07-11T14:25:00.000Z",
  //     },
  //     {
  //       _id: "12343",
  //       userId: "user123",
  //       problemId: "101",
  //       code: "// TLE code",
  //       language: "python",
  //       status: "TimeLimitExceeded",
  //       verdict: "Time Limit Exceeded",
  //       totalTestCases: 10,
  //       passedTestCases: 8,
  //       createdAt: "2025-07-11T14:20:00.000Z",
  //     },
  //     {
  //       _id: "12342",
  //       userId: "user123",
  //       problemId: "101",
  //       code: "// Compilation error code",
  //       language: "cpp",
  //       status: "compile_error",
  //       verdict: "Compilation Error",
  //       createdAt: "2025-07-11T14:15:00.000Z",
  //     },
  //   ];

  const fetchSubmissionData = async () => {
    setLoading(true);
    // Simulate API call
    try {
      console.log("Fetching submission data for ID:", submissionId);
      let userId = Cookies.get("userId31d6cfe0d16ae931b73c59d7e0c089c0");
      if (!userId) {
        console.log("please login");
        return;
      }
      userId = userId.replace(/^"+|"+$/g, "");

      const allSubmissionResponse = await axios.get(
        `${backendUrl}/getAllSubmissionsOfProblem/${userId}/${slug}`
      );

      console.log(
        "All submissions fetched successfully:",
        allSubmissionResponse.data
      );
      setSubmission(allSubmissionResponse.data[0]);
      if (submissionId) {
        setSubmission(
          allSubmissionResponse.data.find(
            (sub: ISubmission) => sub._id === submissionId
          ) || null
        );
      }
      setAllSubmissions(allSubmissionResponse.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching submission data:", err);
      setLoading(false);
      return;
    }
    setTimeout(() => {
      //setSubmission(mockSubmission);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchSubmissionData();
  }, [submissionId, slug]);

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "Accepted":
        return "text-green-400";
      case "Wrong Answer":
        return "text-red-400";
      case "Time Limit Exceeded":
        return "text-yellow-400";
      case "Compilation Error":
        return "text-orange-400";
      case "Runtime Error":
        return "text-pink-400";
      default:
        return "text-gray-400";
    }
  };

  const getVerdictBgColor = (verdict: string) => {
    switch (verdict) {
      case "Accepted":
        return "bg-green-500/10 border-green-500/20";
      case "Wrong Answer":
        return "bg-red-500/10 border-red-500/20";
      case "Time Limit Exceeded":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "Compilation Error":
        return "bg-orange-500/10 border-orange-500/20";
      case "Runtime Error":
        return "bg-pink-500/10 border-pink-500/20";
      default:
        return "bg-gray-500/10 border-gray-500/20";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "Accepted":
        return <CheckCircle className="text-green-400" size={24} />;
      case "Wrong Answer":
        return <XCircle className="text-red-400" size={24} />;
      case "Time Limit Exceeded":
        return <Clock className="text-yellow-400" size={24} />;
      case "Compilation Error":
        return <AlertTriangle className="text-orange-400" size={24} />;
      case "Runtime Error":
        return <AlertTriangle className="text-pink-400" size={24} />;
      default:
        return <XCircle className="text-gray-400" size={24} />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const submittedDate = new Date(dateString);
    const diffInMs = now.getTime() - submittedDate.getTime();

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
    } else {
      return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
    }
  };

  const handleViewSubmission = (submissionId: string) => {
    navigate(`/problems/${slug}/submission/${submissionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-purple-400">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-xl">Loading submission...</span>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">Submission not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              to={`/problems/${slug}`}
              className="text-gray-400 hover:text-purple-400 transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Submission Result
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Main Submission Status Card */}
        <div
          className={`rounded-2xl border p-8 ${getVerdictBgColor(
            submission.verdict
          )}`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              {getVerdictIcon(submission.verdict)}
              <h2
                className={`text-3xl font-bold ${getVerdictColor(
                  submission.verdict
                )}`}
              >
                {submission.verdict}
              </h2>
            </div>
            <div className="text-gray-400 text-lg">
              Submitted {formatTimeAgo(submission.createdAt)}
            </div>
          </div>
          {submission.verdict === "Time Limit Exceeded" && (
            <h2 className="text-xl pb-8">
              Time limit exceeded on testcase {submission.passedTestCases + 1}
            </h2>
          )}

          {/* // error renderring box  */}
          {(submission.verdict === "Compilation Error" ||
            submission.verdict === "Runtime Error") && (
            <div>
              <h2>Error Message</h2>
              <div className="border-red-500 border-2 p-4 mt-2 mb-6 rounded-sm">
                <h2 className="text-amber-300">
                  {JSON.stringify(submission.error)}
                </h2>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-700">
              <div className="text-sm text-gray-400 mb-2">Language</div>
              <div className="text-2xl font-bold text-purple-400 capitalize">
                {submission.language}
              </div>
            </div>

            {submission.totalTestCases && (
              <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Test Cases</div>
                <div className="text-2xl font-bold text-blue-400">
                  <AnimatedCounter
                    start={0}
                    end={submission.passedTestCases || 0}
                    className="text-2xl font-bold text-blue-400"
                  />
                  /
                  <AnimatedCounter
                    start={0}
                    end={submission.totalTestCases}
                    className="text-2xl font-bold text-blue-400"
                  />
                </div>
              </div>
            )}

            {submission.runtimeMs !== undefined && (
              <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-2 flex items-center space-x-2">
                  <Timer size={16} />
                  <span>Runtime</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400">
                  <AnimatedCounter
                    start={0}
                    end={submission.runtimeMs}
                    suffix=" ms"
                    className="text-2xl font-bold text-emerald-400"
                  />
                </div>
              </div>
            )}

            {submission.memoryKb && (
              <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-2 flex items-center space-x-2">
                  <MemoryStick size={16} />
                  <span>Memory</span>
                </div>
                <div className="text-2xl font-bold text-cyan-400">
                  <AnimatedCounter
                    start={0}
                    end={Math.round((submission.memoryKb / 1024) * 10) / 10}
                    suffix=" KB"
                    className="text-2xl font-bold text-cyan-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Failed Test Case */}
          {submission.verdict === "Wrong Answer" && (
            <div className="bg-red-950/30 border border-red-800 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center space-x-2">
                <XCircle size={20} />
                <span>Failed Test Case</span>
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Input:</div>
                  <code className="text-green-300 font-mono text-lg">
                    {submission.failedTestCase.input}
                  </code>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Your Output:</div>
                  <code className="text-red-300 font-mono text-lg">
                    {submission.failedTestCase.output}
                  </code>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">
                    Expected Output:
                  </div>
                  <code className="text-blue-300 font-mono text-lg">
                    {submission.failedTestCase.expectedOutput}
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Code Section */}
          <div className="bg-gray-900/60 rounded-xl border border-gray-700">
            <button
              onClick={() => setShowCode(!showCode)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-800/50 transition-colors rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <Code size={20} className="text-purple-400" />
                <h3 className="text-xl font-bold">Submitted Code</h3>
              </div>
              {showCode ? (
                <ChevronUp className="text-gray-400" />
              ) : (
                <ChevronDown className="text-gray-400" />
              )}
            </button>

            {showCode && (
              <div className="px-6 pb-6">
                <div className="border border-gray-600 rounded-lg overflow-hidden">
                  <Editor
                    height="400px"
                    language={
                      submission.language === "cpp"
                        ? "cpp"
                        : submission.language
                    }
                    theme="vs-dark"
                    value={submission.code}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineNumbers: "on",
                      renderWhitespace: "selection",
                      wordWrap: "on",
                      automaticLayout: true,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* All Submissions Section */}
        <div className="bg-gray-900/60 rounded-2xl border border-gray-700 p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <Calendar size={24} className="text-purple-400" />
            <span>All Submissions</span>
          </h2>

          <div className="space-y-4">
            {allSubmissions.map((sub) => (
              <div
                key={sub._id}
                className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800 transition-all duration-200 border border-gray-700 hover:border-purple-500/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {getVerdictIcon(sub.verdict)}
                    <div>
                      <div
                        className={`font-bold text-lg ${getVerdictColor(
                          sub.verdict
                        )}`}
                      >
                        {sub.verdict}
                      </div>
                      <div className="text-gray-400">
                        {formatTimeAgo(sub.createdAt)} • {sub.language}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    {sub.totalTestCases && (
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Test Cases</div>
                        <div className="text-lg font-semibold text-blue-400">
                          {sub.passedTestCases}/{sub.totalTestCases}
                        </div>
                      </div>
                    )}
                    {sub.runtimeMs !== undefined && (
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Runtime</div>
                        <div className="text-lg font-semibold text-emerald-400">
                          {sub.runtimeMs} ms
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => handleViewSubmission(sub._id)}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResult;
