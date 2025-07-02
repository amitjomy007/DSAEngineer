import React, { useEffect, useState } from "react";
import type { IProblem } from "../../interfaces/Iproblem";
import axios from "axios";
import Cookies from "js-cookie";
const AddProblemPage: React.FC = () => {
  const [problemJson, setProblemJson] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userId,setUserId] = useState<string >("");
  let gotErrorMessage: string | null = null;
  useEffect(() => {
      const cookieUserId = Cookies.get("userId");
      if (cookieUserId) {
        setUserId(cookieUserId);
      }
  }, []);
//chat gpt made this code submitProblemToBackend (The error handling part)
  const submitProblemToBackend = async (problem: IProblem) => {
  try {
    console.log("Submitting problem:", problem);
    problem.problemAuthorId = userId;
    problem.problemAuthorId = problem.problemAuthorId.replace(/^"|"$/g, ""); // GPT Fix suggestion (wroked)

    console.log("problemAuthor ID: ", problem.problemAuthorId);
    const response = await axios.post("http://localhost:8000/addProblem", problem);

    console.log("response when trying to submit: ", response);
    console.log("Response status: ", response.status);

    if (response.status === 200) {
      gotErrorMessage = ""; // Clear previous error
      return true;
    } else {
      gotErrorMessage = response.data?.message || "Unexpected error occurred.";
      console.log("Response message: ", gotErrorMessage);
      return false;
    }
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      // Axios-specific error
      gotErrorMessage =
        e.response?.data?.message ||
        e.response?.statusText ||
        `Request failed with status ${e.response?.status}`;
    } else if (e instanceof Error) {
      // Generic JS error
      gotErrorMessage = e.message;
    } else {
      gotErrorMessage = "An unknown error occurred.";
    }

    console.error("Submission failed (caught error):", e);
    console.log("Error message set to: ", gotErrorMessage);
    return false;
  }
};


  const handleSubmit = async () => {
    setError(null);
    try {
      const parsed = JSON.parse(problemJson);

      const isSuccess = await submitProblemToBackend(parsed);
      if (isSuccess) {
        setShowModal(true);
        setProblemJson("");
        setTimeout(() => setShowModal(false), 3500);
      } else {
        setError(gotErrorMessage || "Submission failed. Please try again.");
      }
    } catch (e) {
      setError("Invalid JSON format., catched error: " + e);
    }
  };
  const jsonPlaceholder = `{
  "isApproved": false,
  "problemAuthorId": "USER_OBJECT_ID",
  "problemNumber": 1,
  "title": "Two Sum",
  "titleSlug": "two-sum",
  "difficulty": "Easy",
  "tags": [],
  "description": "Given an array of integers...",
  "examples": [
    {
      "input": "nums = [2,7,11,15], target = 9",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
    }
  ],
  "constraints": [
    "2 <= nums.length <= 10^4",
    "Each input would have exactly one solution"
  ],
  "hints": ["Try using a hash map"],
  "testcases": [
    { "input": "[2,7,11,15], 9", "output": "[0,1]" }
  ],
  "timeLimit": 1,
  "memoryLimit": 128,
  "allowedLanguages": ["javascript", "python", "cpp", "java"]
}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f1f2e] to-[#10101a] text-white flex flex-col items-center px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-purple-300">
        Add New Problem
      </h1>

      <div className="w-full max-w-4xl">
        <label className="block mb-2 text-sm font-medium text-purple-200">
          Problem JSON
        </label>
        <textarea
          value={problemJson}
          onChange={(e) => setProblemJson(e.target.value)}
          placeholder={`{
  "isApproved": false,
  "problemAuthorId": "USER_OBJECT_ID",
  "problemNumber": 1,
  "title": "Two Sum",
  "titleSlug": "two-sum",
  "difficulty": "Easy",
  "tags": [],
  "description": "Given an array of integers...",
  "examples": [{ "input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "..." }],
  "constraints": ["2 <= nums.length <= 10^4", "Each input would have exactly one solution"],
  "hints": ["Try using a hash map"],
  "testcases": [{ "input": "[2,7,11,15], 9", "output": "[0,1]" }],
  "timeLimit": 1,
  "memoryLimit": 128,
  "allowedLanguages": ["javascript", "python", "cpp", "java"]
}`}
          rows={20}
          className="w-full p-4 rounded-xl bg-[#202030] text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono text-sm"
        />

        {error && <p className="text-red-400 mt-2">{error}</p>}

        <div className="flex flex-col md:flex-row justify-between">
          <button
            onClick={handleSubmit}
            className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 transition-colors rounded-xl font-semibold"
          >
            Submit Problem
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(jsonPlaceholder);
            }}
            className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 transition-colors rounded-xl font-semibold"
          >
            Copy JSON
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
          <span>✅ Problem submitted successfully</span>
          <button
            onClick={() => setShowModal(false)}
            className="ml-2 hover:text-gray-200 text-xl font-bold"
          >
            ×
          </button>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddProblemPage;
