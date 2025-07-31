import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

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
  examples: { input: string; output: string; explanation?: string; _id?: string }[];
  constraints: string[];
  hints: string[];
  testcases: { input: string; output: string; _id?: string }[];
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

interface ISubmission {
  _id: string;
  verdict: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error";
  language: string;
  runtimeMs: number;
  memory: number;
  submittedAt: string;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL || "3000";
console.log("backendUrl:", backendUrl);

const SubmissionsListTabComponent = () => {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<ISolveProblem | null>(null);
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    examples: [],
    constraints: [],
    hints: [],
    testcases: [],
    timeLimit: 1,
    memoryLimit: 128,
    allowedLanguages: ["javascript", "python", "java", "cpp"],
    editorialId: "64a520f19b2485e1449de800",
    successfulSubmissionCount: 1247,
    failedSubmissionCount: 423,
    upvoteCount: 1854,
    downvoteCount: 127,
    userProblemStatus: "attempted",
    userVoteStatus: "upvoted",
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const uId = Cookies.get("userId31d6cfe0d16ae931b73c59d7e0c089c0");
        const response = await axios.get(
          `${backendUrl}/getProblem/${slug}`,
          { headers: { "user-id": uId } }
        );
        setProblem(response.data.problem);
      } catch (err) {
        console.log("Failed to fetch problem data, using mock data.", err);
        setProblem(mockProblem);
      }

      try {
        const uIdNotFormatted = Cookies.get(
          "userId31d6cfe0d16ae931b73c59d7e0c089c0"
        );
        let userId = undefined;
        if (uIdNotFormatted)
          userId = uIdNotFormatted.trim().replace(/^"+|"+$/g, "");
        else return;
        const subsResponse = await axios.get(
          `${backendUrl}/getAllSubmissionsOfProblem/${userId}/${slug}`
        );
        setSubmissions(subsResponse.data);
      } catch (err) {
        console.log("Failed to fetch submissions:", err);
        setSubmissions([]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [slug]);

  const formatLanguage = (lang: string) => {
    const languageMap: { [key: string]: string } = {
      cpp: "C++",
      javascript: "JavaScript",
      python: "Python",
      java: "Java",
    };
    return languageMap[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  const getverdictComponent = (verdict: ISubmission["verdict"]) => {
    const verdictStyles: { [key: string]: string } = {
      Accepted: "text-[#70d873]", // green accent matching your theme
      "Wrong Answer": "text-[#ff8686]", // red accent
      "Time Limit Exceeded": "text-[#ffe084]", // warning yellow accent
      "Runtime Error": "text-[#e3975a]", // orange accent
    };
    const verdictIcons: { [key: string]: React.ElementType } = {
      Accepted: CheckCircle,
      "Wrong Answer": XCircle,
      "Time Limit Exceeded": Clock,
      "Runtime Error": AlertTriangle,
    };
    const Icon = verdictIcons[verdict] || "span";
    return (
      <span
        className={`flex items-center font-semibold gap-2 ${verdictStyles[verdict] || ""
          }`}
      >
        <Icon size={16} className="mr-1" />
        {verdict}
      </span>
    );
  };

  if (isLoading || !problem) {
    return (
      <div className="min-h-screen bg-[#171c23] flex items-center justify-center">
        <div className="text-[#f8f9fa] text-lg">Loading Submissions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171c23] text-[#f8f9fa] font-sans">
      <div className="pt-0">
        <div className="max-w-[800px] mx-auto px-6 py-6">
          {/* Header */}
          <h2 className="text-2xl font-bold mb-4 text-[#67e76e] border-b-2 border-[#24292f] pb-2">
            All Submissions
          </h2>

          {/* Submissions Table */}
          <div className="bg-[#20252c] border border-[#232b36] rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full text-left table-auto">
              <thead className="bg-[#232b36] border-b border-[#232b36]">
                <tr>
                  <th className="p-4 text-sm font-semibold text-[#a7adba] w-1/4">
                    Verdict
                  </th>
                  <th className="p-4 text-sm font-semibold text-[#a7adba] w-1/6">
                    Language
                  </th>
                  <th className="p-4 text-sm font-semibold text-[#a7adba] w-1/6">
                    Runtime
                  </th>
                  <th className="p-4 text-sm font-semibold text-[#a7adba] w-1/6">
                    Memory
                  </th>
                  <th className="p-4 text-sm font-semibold text-[#a7adba] w-1/4">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissions && submissions.length > 0 ? (
                  submissions.map((sub) => (
                    <tr
                      key={sub._id}
                      className="border-b border-[#232b36] last:border-b-0 hover:bg-[#232b36]/70 transition-colors"
                    >
                      <td className="p-4">{getverdictComponent(sub.verdict)}</td>
                      <td className="p-4 text-[#e5e5f5]">
                        {formatLanguage(sub.language)}
                      </td>
                      <td className="p-4 text-[#e5e5f5]">{sub.runtimeMs} ms</td>
                      <td className="p-4 text-[#e5e5f5]">{sub.memory} MB</td>
                      <td className="p-4 text-[#a7adba] text-sm">
                        {new Date(sub.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center p-8 text-[#a7adba] italic"
                    >
                      You have no submissions for this problem yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsListTabComponent;
