// pages/ProfilePage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import {
  User,
  // Calendar,
  // Trophy,
  // Code,
  // Target,
  // Clock,
  // Users,
  // Brain,
  // Star,
  // Medal,
  // UserPlus,
  Crown,
  CheckCircle,
  // Flame,
  // BarChart3,
} from "lucide-react";
import NavbarNew from "../components/layout/NavbarNew";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Interfaces (keeping your existing ones)
interface ProblemDetails {
  _id: string;
  title: string;
  titleSlug: string;
  difficulty: string;
  tags: string[];
}

interface ProfileData {
  _id: string;
  fullName: string;
  email: string;
  role: string | null;
  isOwnProfile: boolean;
  createdAt: string;
  totalSubmissions: number;
  acceptedSubmissions: number;
  averageRuntime: number | null;
  averageMemory: number | null;
  languageStats: Record<string, number>;
  verdictStats: Record<string, number>;
  solvedProblemsDetails: ProblemDetails[];
  submissionCalendar: Array<{ date: string; count: number }>;
  recentSubmissions: Array<{
    _id: string;
    problemId: string;
    language: string;
    verdict: string;
    submittedAt: string;
  }>;
}

// Left Sidebar - User Info (Dark Theme)
const LeftUserCard: React.FC<{ profileData: ProfileData }> = ({
  profileData,
}) => {
  const memberSince = new Date(profileData.createdAt).getFullYear();
  const totalSolved = profileData.solvedProblemsDetails.length;

  return (
    <div className="bg-gray-900/80 border border-gray-800/50 rounded-lg p-3 mb-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-white truncate">
            {profileData.fullName}
          </div>
          <div className="text-xs text-gray-400 truncate">
            {profileData.email}
          </div>
        </div>
      </div>

      <div className="space-y-1 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>Since:</span>
          <span className="font-mono text-gray-300">{memberSince}</span>
        </div>
        <div className="flex justify-between">
          <span>Solved:</span>
          <span className="font-mono text-emerald-400 font-bold">
            {totalSolved}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Contests Attended:</span>
          <span className="font-mono text-emerald-400 font-bold">N/A</span>
        </div>

        {profileData.role && (
          <div className="flex justify-between">
            <span>Role:</span>
            <span className="text-purple-300">{profileData.role}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Left Sidebar - Languages
const LeftLanguages: React.FC<{ languageStats: Record<string, number> }> = ({
  languageStats,
}) => {
  const formatLanguage = (lang: string) => {
    const map: { [key: string]: string } = {
      cpp: "C++",
      javascript: "JavaScript",
      python: "Python",
      java: "Java",
    };
    return map[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  const languages = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="bg-gray-900/80 border border-gray-800/50 rounded-lg p-3 mb-3">
      <h3 className="text-sm font-semibold text-gray-200 mb-2">Languages</h3>
      {languages.length > 0 ? (
        <div className="space-y-1">
          {languages.map(([lang, count]) => (
            <div key={lang} className="flex justify-between text-xs">
              <span className="text-gray-300">{formatLanguage(lang)}</span>
              <span className="text-purple-400 font-mono font-bold">
                {count}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-gray-500">No data</div>
      )}
    </div>
  );
};
// Left Sidebar - Friends with custom thin scrollbar (no arrows)
const LeftFriends: React.FC = () => {
  const friends = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    name: "Coming Soon",
  }));

  return (
    <div className="bg-gray-900/80 border border-gray-800/50 rounded-lg p-3 mb-3">
      <h3 className="text-sm font-semibold text-gray-200 mb-2">Friends</h3>
      <div
        className="h-60 overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#4b5563 #1f2937",
        }}
      >
        <style>
          {`
            /* Hide default scrollbar arrows for Firefox */
            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            ::-webkit-scrollbar-thumb {
              background-color: #6b7280; /* Tailwind gray-500 */
              border-radius: 4px;
            }
            ::-webkit-scrollbar-track {
              background-color: #1f2937; /* Tailwind gray-900 */
            }
            /* Remove scroll buttons/arrows */
            ::-webkit-scrollbar-button {
              display: none;
              width: 0;
              height: 0;
            }
            /* For Firefox */
            scrollbar-width: thin;
            scrollbar-color: #6b7280 #1f2937;
          `}
        </style>
        <div className="space-y-0">
          {friends.map((friend, index) => (
            <div
              key={friend.id}
              className={`flex items-center gap-2 p-1.5 text-xs ${
                index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
              }`}
            >
              <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-2 h-2 text-gray-300" />
              </div>
              <span className="text-gray-300">{friend.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// New LeetCode Style Activity Calendar Component
const ActivityCalendar: React.FC<{
  submissionCalendar: Array<{ date: string; count: number }>;
}> = ({ submissionCalendar }) => {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setDate(today.getDate() - 364); // Start date is 364 days before today

  const submissionMap = new Map(
    submissionCalendar.map((item) => [item.date, item.count])
  );

  const calendar: {
    date: string;
    count: number;
    month: number;
  }[] = [];

  // FIX: Loop now correctly generates exactly 365 days.
  for (let i = 0; i < 365; i++) {
    const currentDate = new Date(oneYearAgo);
    currentDate.setDate(oneYearAgo.getDate() + i);
    const dateISO = currentDate.toISOString().slice(0, 10);
    calendar.push({
      date: dateISO,
      count: submissionMap.get(dateISO) || 0,
      month: currentDate.getMonth(),
    });
  }

  // Add padding for the first week to align days correctly (e.g., if it starts on Wednesday)
  const firstDayOfWeek = new Date(calendar[0].date).getDay();
  const paddedCalendar = [...Array(firstDayOfWeek).fill(null), ...calendar];

  const weeks: ((typeof calendar)[0] | null)[][] = [];
  for (let i = 0; i < paddedCalendar.length; i += 7) {
    weeks.push(paddedCalendar.slice(i, i + 7));
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getIntensityColor = (count: number) => {
    if (count === 0) return "bg-gray-800 border-gray-700";
    if (count <= 2) return "bg-emerald-800/40 border-emerald-700";
    if (count <= 4) return "bg-emerald-600/60 border-emerald-500";
    if (count <= 6) return "bg-emerald-500/80 border-emerald-400";
    return "bg-emerald-400 border-emerald-300";
  };

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const totalSubmissions = submissionCalendar.reduce(
    (acc, item) => acc + item.count,
    0
  );

  return (
    <div className="bg-gray-900/80 border border-gray-800/50 rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-3">Activity</h3>
      <div className="text-xs text-gray-400 mb-2">
        {totalSubmissions} submissions in the last year
      </div>
      <div className="flex">
        {/* Day Labels */}
        <div className="flex flex-col mr-2 mt-4 select-none">
          {dayLabels.map((day, idx) => (
            <div
              key={day}
              className={`text-xs text-gray-500 h-3 flex items-center mb-0.5 ${
                idx % 2 !== 0 ? "opacity-0" : "" // Show Sun, Tue, Thu, Sat
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
          {/* Month Labels */}
          <div className="flex mb-1 select-none">
            {weeks.map((week, idx) => {
              const firstDayOfMonth = week.find(
                (day) => day && new Date(day.date).getDate() === 1
              );
              const showMonth = firstDayOfMonth;

              return (
                <div
                  key={idx}
                  className="w-3 text-xs text-gray-500 text-left mr-0.5"
                >
                  {showMonth ? monthNames[firstDayOfMonth.month] : "\u00A0"}
                </div>
              );
            })}
          </div>

          {/* Date Squares */}
          <div className="flex gap-0.5">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-0.5">
                {week.map((day, dayIdx) =>
                  day ? (
                    <div
                      key={day.date}
                      className={`w-3 h-3 rounded-sm  cursor-pointer ${getIntensityColor(
                        day.count
                      )}`}
                      title={`${day.date}: ${day.count} submissions`}
                    />
                  ) : (
                    <div
                      key={`empty-${weekIdx}-${dayIdx}`}
                      className="w-3 h-3"
                    />
                  )
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500 select-none">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-gray-800 "></div>
              <div className="w-3 h-3 rounded-sm bg-emerald-800/40 "></div>
              <div className="w-3 h-3 rounded-sm bg-emerald-600/60 "></div>
              <div className="w-3 h-3 rounded-sm bg-emerald-500/80 "></div>
              <div className="w-3 h-3 rounded-sm bg-emerald-400 "></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main - LeetCode Style Progress Circle with Progress Bars
const LeetCodeProgressRing: React.FC<{
  difficultyStats: Record<string, number>;
}> = ({ difficultyStats }) => {
  // Hardcoded as requested
  const totalEasy = 8;
  const totalMedium = 0;
  const totalHard = 1;

  const easyCount = difficultyStats.Easy || 0;
  const mediumCount = difficultyStats.Medium || 0;
  const hardCount = difficultyStats.Hard || 0;
  const totalSolved = easyCount + mediumCount + hardCount;
  const totalProblems = totalEasy + totalMedium + totalHard;

  const percentage =
    totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0;

  // Calculate progress percentages for each difficulty
  const easyProgress = totalEasy > 0 ? (easyCount / totalEasy) * 100 : 0;
  const mediumProgress =
    totalMedium > 0 ? (mediumCount / totalMedium) * 100 : 0;
  const hardProgress = totalHard > 0 ? (hardCount / totalHard) * 100 : 0;

  return (
    <div className=" bg-gray-900/80 border border-gray-800/50 rounded-lg p-4">
      <div className="flex items-center gap-6">
        {/* LeetCode Style Ring */}
        <div className="relative">
          <svg width="80" height="80" className="transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke="rgb(55, 65, 81)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke="rgb(147, 51, 234)"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${(percentage / 100) * 201.06} 201.06`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{totalSolved}</div>
              <div className="text-xs text-gray-400">Solved</div>
            </div>
          </div>
        </div>

        {/* LeetCode Style Stats with Progress Bars */}
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white mb-3">Problems Solved</h2>
          <div className="space-y-2">
            {/* Easy */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-300">Easy</span>
                <div className="flex-1 mx-2">
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${easyProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <span className="text-sm font-mono text-emerald-400">
                <span className="font-bold">{easyCount}</span>
                <span className="text-gray-500"> / {totalEasy}</span>
              </span>
            </div>

            {/* Medium */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm text-gray-300">Medium</span>
                <div className="flex-1 mx-2">
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${mediumProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <span className="text-sm font-mono text-amber-400">
                <span className="font-bold">{mediumCount}</span>
                <span className="text-gray-500"> / {totalMedium}</span>
              </span>
            </div>

            {/* Hard */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-300">Hard</span>
                <div className="flex-1 mx-2">
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${hardProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <span className="text-sm font-mono text-red-400">
                <span className="font-bold">{hardCount}</span>
                <span className="text-gray-500"> / {totalHard}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main - LeetCode Style Stats Grid
const LeetCodeStatsGrid: React.FC<{ profileData: ProfileData }> = ({
  profileData,
}) => {
  //const totalSolved = profileData.solvedProblemsDetails.length;
  const acceptanceRate =
    profileData.totalSubmissions > 0
      ? (
          (profileData.acceptedSubmissions / profileData.totalSubmissions) *
          100
        ).toFixed(1)
      : "0.0";

  // Calculate streaks properly
  const calculateCurrentStreak = () => {
    if (!profileData.submissionCalendar?.length) return 0;
    const sorted = profileData.submissionCalendar.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    let streak = 0;
    for (const activity of sorted) {
      if (activity.count > 0) streak++;
      else break;
    }
    return streak;
  };

  const calculateMaxStreak = () => {
    if (!profileData.submissionCalendar?.length) return 0;
    const sorted = profileData.submissionCalendar.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    let maxStreak = 0,
      currentStreak = 0;
    for (const activity of sorted) {
      if (activity.count > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else currentStreak = 0;
    }
    return maxStreak;
  };

  return (
    <div className="bg-gray-900/80 border border-gray-800/50 rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-4">Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3  pt-7 gap-4">
        <div className="text-center  ">
          <div className="text-2xl font-bold text-blue-400 font-mono">
            {acceptanceRate}%
          </div>
          <div className="text-xs text-gray-400 mt-1">Acceptance Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400 font-mono">
            {calculateCurrentStreak()}
          </div>
          <div className="text-xs text-gray-400 mt-1">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400 font-mono">
            {calculateMaxStreak()}
          </div>
          <div className="text-xs text-gray-400 mt-1">Max Streak</div>
        </div>
      </div>
    </div>
  );
};

const Skills: React.FC<{
  tagStats: Record<string, number>;
  profileData: ProfileData;
}> = ({ tagStats }) => {
  const topTags = Object.entries(tagStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <div>
      {/* Skills */}
      <div className="bg-gray-900/80 border border-gray-800/50 rounded-lg p-4">
        <h3 className="text-lg font-bold text-white mb-3">Skills</h3>
        <div className="grid  gap-2">
          {topTags.length > 0 ? (
            topTags.map(([tag, count]) => (
              <div
                key={tag}
                className="flex items-center justify-between p-2 bg-gray-800/50 rounded"
              >
                <span className="text-sm text-gray-300 capitalize">
                  {tag.replace("-", " ")}
                </span>
                <span className="text-sm font-mono text-emerald-400 font-bold">
                  {count}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-400 py-4">
              No skills data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// Main - Skills & Topics (LeetCode Style)
const Performance: React.FC<{
  tagStats: Record<string, number>;
  profileData: ProfileData;
}> = ({  profileData }) => {
    
  // const topTags = Object.entries(tagStats)
  //   .sort(([, a], [, b]) => b - a)
  //   .slice(0, 10);

  const formatAverage = (value: number | null, unit: string) => {
    if (!value) return "N/A";
    return `${Math.round(value * 100) / 100}${unit}`;
  };

  return (
    <div className="flex w-full flex-col">
      {/* Additional Stats */}
      <div className="bg-gray-900/80 border border-gray-800/50 rounded-lg p-4">
        <h3 className="text-lg font-bold text-white mb-3">Performance</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Total Submissions</span>
            <span className="text-sm font-mono text-purple-400 font-bold">
              {profileData.totalSubmissions}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Accepted Submissions</span>
            <span className="text-sm font-mono text-emerald-400 font-bold">
              {profileData.acceptedSubmissions}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Average Runtime</span>
            <span className="text-sm font-mono text-blue-400">
              {formatAverage(profileData.averageRuntime, "ms")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Average Memory</span>
            <span className="text-sm font-mono text-amber-400">
              {formatAverage(profileData.averageMemory, "MB")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Ranking</span>
            <span className="text-sm font-mono text-gray-400">N/A</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main - Contest Section
const ContestSection: React.FC = () => {
  return (
    <div className=" bg-gray-900/80 border border-gray-800/50 rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-3">Contest</h3>
      <div className="text-center py-6 text-gray-400">
        <Crown className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <div className="text-sm">Coming Soon</div>
        <div className="text-xs text-gray-500 mt-1">
          Participate in coding contests
        </div>
      </div>
    </div>
  );
};

// Main - Recent Submissions with alternating colors
const RecentSubmissionsTable: React.FC<{
  recentSubmissions: ProfileData["recentSubmissions"];
  solvedProblems: ProblemDetails[];
}> = ({ recentSubmissions, solvedProblems }) => {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const submittedDate = new Date(dateString);
    const diffMs = now.getTime() - submittedDate.getTime();

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const acceptedSubmissions = recentSubmissions.filter(
    (sub) => sub.verdict === "Accepted"
  );
  const problemMap = new Map(solvedProblems.map((p) => [p._id, p]));

  return (
    <div className="bg-gray-900/80 border border-gray-800/50 rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-4">
        Recent Accepted Solutions
      </h3>

      <div className="overflow-hidden">
        {acceptedSubmissions.length > 0 ? (
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full">
              <thead className="text-xs text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="text-left py-2">Problem</th>
                  <th className="text-center py-2">Difficulty</th>
                  <th className="text-center py-2">Language</th>
                  <th className="text-right py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {acceptedSubmissions.map((submission, index) => {
                  const problem = problemMap.get(submission.problemId);
                  return (
                    <tr
                      key={submission._id}
                      className={`border-b border-gray-800/50 hover:bg-gray-800/30 ${
                        index % 2 === 0 ? "bg-gray-800/20" : "bg-gray-700/20"
                      }`}
                    >
                      <td className="py-2 text-sm text-white">
                        {problem?.title || `Problem #${submission.problemId}`}
                      </td>
                      <td className="py-2 text-center">
                        {problem && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              problem.difficulty === "Easy"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : problem.difficulty === "Medium"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-center text-sm text-gray-300">
                        {submission.language}
                      </td>
                      <td className="py-2 text-right text-xs text-gray-400 font-mono">
                        {formatTimeAgo(submission.submittedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 opacity-30" />
            <div className="text-sm">No accepted submissions yet</div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Profile Page Component
const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (!userId) {
        setError("User ID not found in the URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const viewingUserId = Cookies.get(
          "userId31d6cfe0d16ae931b73c59d7e0c089c0"
        );

        const response = await axios.get(`${backendUrl}/profile/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "user-id": viewingUserId || "",
          },
        });

        if (response.data.success) {
          setProfileData(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to fetch profile details.");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileDetails();
  }, [userId]);

  const difficultyStats = useMemo(() => {
    if (!profileData?.solvedProblemsDetails) return {};
    return profileData.solvedProblemsDetails.reduce((acc, problem) => {
      const diff = problem.difficulty || "Other";
      acc[diff] = (acc[diff] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [profileData]);

  const tagStats = useMemo(() => {
    if (!profileData?.solvedProblemsDetails) return {};
    return profileData.solvedProblemsDetails.reduce((acc, problem) => {
      problem.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
  }, [profileData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-sm">No profile data found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
        <NavbarNew/>
      {/* Subtle Background - Your Original Theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-violet-900/5 to-gray-900"></div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="grid grid-cols-12 gap-4">
            {/* Left Sidebar */}
            <div className="flex flex-col   col-span-3 ">
              <LeftUserCard profileData={profileData} />
              <LeftLanguages languageStats={profileData.languageStats} />
              <LeftFriends />
              <Skills tagStats={tagStats} profileData={profileData} />
            </div>

            {/* Main Content - LeetCode Layout */}
            <div className="col-span-9 space-y-4">
              {/* Progress Ring - LeetCode Style with Progress Bars */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LeetCodeProgressRing difficultyStats={difficultyStats} />
                <ContestSection />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LeetCodeStatsGrid profileData={profileData} />

                {/* Skills & Performance - LeetCode Style */}

                <Performance tagStats={tagStats} profileData={profileData} />
              </div>
              <ActivityCalendar
                submissionCalendar={profileData.submissionCalendar}
              />

              {/* Submissions Table - LeetCode Style with Alternating Colors */}
              <RecentSubmissionsTable
                recentSubmissions={profileData.recentSubmissions}
                solvedProblems={profileData.solvedProblemsDetails}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
