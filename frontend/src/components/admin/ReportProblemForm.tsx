import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
// import { AlertTriangle, X } from "lucide-react";
import { Button } from "../ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; //then maybe can delete card.tsx, it has some other dependencies nested to it as well
import { Textarea } from "../ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
interface ReportProblemFormProps {
  problemId: number;
  problemTitle: string;
  onSubmit?: (data: {
    problemId: number;
    message: string;
    reportType: string;
  }) => void;
}

const ReportProblemForm = ({
  problemId,
  problemTitle,
  onSubmit,
}: ReportProblemFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportType, setReportType] = useState("");
  const [message, setMessage] = useState("");

  const reportTypes = [
    { value: "incorrect-solution", label: "Incorrect Expected Output" },
    { value: "unclear-statement", label: "Unclear Problem Statement" },
    { value: "missing-constraints", label: "Missing or Incorrect Constraints" },
    { value: "test-case-issue", label: "Test Case Issue" },
    { value: "typo", label: "Typo or Grammar Error" },
    { value: "other", label: "Other Issue" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportType || !message.trim()) return;

    onSubmit?.({
      problemId,
      message: message.trim(),
      reportType,
    });

    // Reset form and close dialog
    setMessage("");
    setReportType("");
    setIsOpen(false);

    console.log("Problem reported:", {
      problemId,
      problemTitle,
      reportType,
      message,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-orange-400 border-orange-400/30 hover:bg-orange-400/10"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Report Problem
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <span>Report Problem: {problemTitle}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              What type of issue are you reporting?
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select an issue type...</option>
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Describe the issue in detail
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please provide specific details about the issue you encountered. Include any relevant test cases, expected vs actual behavior, or specific sections of the problem statement that are unclear."
              className="min-h-[120px] bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={!reportType || !message.trim()}
            >
              Submit Report
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportProblemForm;
