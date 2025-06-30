import { useState } from "react";
import { Plus } from "lucide-react";
import ProblemCardWithSubmissions from "./ProblemCardWithSubmissions";
import AddEditProblemForm from "./AddEditProblemForm";
import { Button } from "../ui/button";
import axios from "axios";

interface ProblemListProps {
  onViewSubmissions?: (problemId: number, problemTitle: string) => void;
}
//example, tag and problemformdata interface Gemini 2.5 Pro generated
//may have to review
interface Example {
  id: string;
  input: string;
  output: string;
  explanation?: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}
interface ProblemFormData {
  title: string;
  difficulty: string;
  description: string;
  constraints: string;
  solution: string;
  examples: Example[];
  tags: Tag[];
}

const ProblemList = ({ onViewSubmissions }: ProblemListProps) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const problems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy" as const,
      acceptanceRate: "49.2%",
      tags: [
        { name: "Array", color: "bg-blue-500/20 text-blue-400" },
        { name: "Hash Table", color: "bg-green-500/20 text-green-400" },
      ],
      likes: 1240,
      submissions: 2500,
      timeAgo: "2 days ago",
      status: "solved" as const,
      isBookmarked: true,
    },
    {
      id: 2,
      title: "Add Two Numbers",
      difficulty: "Medium" as const,
      acceptanceRate: "35.8%",
      tags: [
        { name: "Linked List", color: "bg-purple-500/20 text-purple-400" },
        { name: "Math", color: "bg-orange-500/20 text-orange-400" },
        { name: "Recursion", color: "bg-pink-500/20 text-pink-400" },
      ],
      likes: 890,
      submissions: 1800,
      timeAgo: "2 days ago",
      status: "attempted" as const,
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium" as const,
      acceptanceRate: "33.1%",
      tags: [
        { name: "Hash Table", color: "bg-green-500/20 text-green-400" },
        { name: "String", color: "bg-cyan-500/20 text-cyan-400" },
        { name: "Sliding Window", color: "bg-teal-500/20 text-teal-400" },
      ],
      likes: 1567,
      submissions: 3200,
      timeAgo: "2 days ago",
      isBookmarked: true,
    },
    {
      id: 4,
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard" as const,
      acceptanceRate: "34.5%",
      tags: [
        { name: "Array", color: "bg-blue-500/20 text-blue-400" },
        { name: "Binary Search", color: "bg-red-500/20 text-red-400" },
      ],
      likes: 892,
      submissions: 1245,
      timeAgo: "3 days ago",
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      difficulty: "Medium" as const,
      acceptanceRate: "32.4%",
      tags: [
        { name: "String", color: "bg-cyan-500/20 text-cyan-400" },
        {
          name: "Dynamic Programming",
          color: "bg-indigo-500/20 text-indigo-400",
        },
      ],
      likes: 1123,
      submissions: 2890,
      timeAgo: "4 days ago",
      status: "solved" as const,
      isBookmarked: true,
    },
    {
      id: 6,
      title: "ZigZag Conversion",
      difficulty: "Medium" as const,
      acceptanceRate: "42.1%",
      tags: [{ name: "String", color: "bg-cyan-500/20 text-cyan-400" }],
      likes: 756,
      submissions: 1567,
      timeAgo: "5 days ago",
      status: "reported" as const,
    },
  ];

  // this type may have to be reviewed
  const handleAddProblem = async (data: ProblemFormData) => {
    console.log("Adding problem:", data);
    // response = await axios.post("http://localhost:8000/judge", payload);
    try{
      const response = await axios.post("http://localhost:8000/addProblem", data);
      console.log("Added and got response: ", response);
    }catch(error){
      console.log("catched error trying to post with axios: ", error);
    }
    // Here you would typically send the data to your backend
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <p className="text-slate-400">
            Showing {problems.length} of {problems.length} problems
          </p>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Problem
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-sm">Sort by:</span>
          <select className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>Difficulty</option>
            <option>Acceptance Rate</option>
            <option>Most Recent</option>
            <option>Most Liked</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {problems.map((problem) => (
          <ProblemCardWithSubmissions
            key={problem.id}
            problem={problem}
            onViewSubmissions={onViewSubmissions}
          />
        ))}
      </div>

      {showAddForm && (
        <AddEditProblemForm
          onSubmit={handleAddProblem}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default ProblemList;
export type {Tag};