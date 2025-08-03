
import { User, Trophy, Calendar, Code, Target, Users, Award } from 'lucide-react';

const Profile = () => {
  // Sample data from backend
  const userData = {
    name: "amit test",
    email: "johndoeexample@example.com",
    role: "N/A",
    memberSince: "Invalid Date",
    overallStats: {
      problemsSolved: 1,
      totalSubmissions: 73,
      acceptedSubmissions: 7,
      successRate: 9.59
    },
    problemsByDifficulty: {
      easy: 1,
      medium: 0,
      hard: 0
    },
    topicsPracticed: [
      { name: "Array", solved: 1 },
      { name: "Searching", solved: 1 }
    ],
    submissionsByLanguage: {
      cpp: 72,
      python: 1
    },
    submissionsByVerdict: {
      "Accepted": 7,
      "Compilation Error": 20,
      "Memory Limit Exceeded": 1,
      "Not Accepted": 1,
      "Runtime Error": 16,
      "Time Limit Exceeded": 5,
      "Wrong Answer": 23
    },
    submissionActivity: [
      { date: "2025-07-13", submissions: 10 },
      { date: "2025-07-21", submissions: 1 },
      { date: "2025-07-29", submissions: 45 },
      { date: "2025-07-30", submissions: 11 },
      { date: "2025-07-31", submissions: 5 },
      { date: "2025-08-01", submissions: 1 }
    ],
    recentSubmissions: [
      { problemId: "686682cecd48d8b19847c954", verdict: "Wrong Answer", language: "cpp", submitted: "01/08/2025, 11:03:13" },
      { problemId: "686bf5928189e740fd161de4", verdict: "Accepted", language: "cpp", submitted: "31/07/2025, 18:43:00" },
      { problemId: "686bf5928189e740fd161de4", verdict: "Wrong Answer", language: "cpp", submitted: "31/07/2025, 18:42:33" },
      { problemId: "686bf5928189e740fd161de4", verdict: "Wrong Answer", language: "cpp", submitted: "31/07/2025, 18:38:05" },
      { problemId: "686bf5928189e740fd161de4", verdict: "Accepted", language: "cpp", submitted: "31/07/2025, 17:07:10" },
      { problemId: "686bf5928189e740fd161de4", verdict: "Wrong Answer", language: "cpp", submitted: "31/07/2025, 17:06:55" },
      { problemId: "686bf5928189e740fd161de4", verdict: "Wrong Answer", language: "cpp", submitted: "30/07/2025, 22:14:24" },
      { problemId: "686bf5928189e740fd161de4", verdict: "Wrong Answer", language: "cpp", submitted: "30/07/2025, 21:19:27" },
      { problemId: "686bf5928189e740fd161de4", verdict: "Wrong Answer", language: "cpp", submitted: "30/07/2025, 20:32:53" },
      { problemId: "686bf5928189e740fd161de4", verdict: "Wrong Answer", language: "cpp", submitted: "30/07/2025, 20:32:11" }
    ]
  };

  // Helper function to get verdict color
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Accepted': return 'text-green-400';
      case 'Wrong Answer': return 'text-red-400';
      case 'Time Limit Exceeded': return 'text-yellow-400';
      case 'Compilation Error': return 'text-orange-400';
      case 'Runtime Error': return 'text-pink-400';
      case 'Memory Limit Exceeded': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  // Profile Header Component
  const ProfileHeader = () => (
    <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/20">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{userData.name}</h1>
          <p className="text-gray-300 mb-1">📧 {userData.email}</p>
          <p className="text-gray-400">👤 Role: {userData.role}</p>
          <p className="text-gray-400">📅 Member since: {userData.memberSince}</p>
        </div>
      </div>
    </div>
  );

  // Overall Statistics Component
  const OverallStats = () => (
    <div className="bg-gray-900/60 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <span>Overall Statistics</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{userData.overallStats.problemsSolved}</div>
          <div className="text-sm text-gray-400">Problems Solved</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{userData.overallStats.totalSubmissions}</div>
          <div className="text-sm text-gray-400">Total Submissions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{userData.overallStats.acceptedSubmissions}</div>
          <div className="text-sm text-gray-400">Accepted</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">{userData.overallStats.successRate}%</div>
          <div className="text-sm text-gray-400">Success Rate</div>
        </div>
      </div>
    </div>
  );

  // Problems by Difficulty Component
  const ProblemsByDifficulty = () => (
    <div className="bg-gray-900/60 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <Target className="w-5 h-5 text-red-400" />
        <span>Problems by Difficulty</span>
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{userData.problemsByDifficulty.easy}</div>
          <div className="text-sm text-gray-400">Easy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{userData.problemsByDifficulty.medium}</div>
          <div className="text-sm text-gray-400">Medium</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">{userData.problemsByDifficulty.hard}</div>
          <div className="text-sm text-gray-400">Hard</div>
        </div>
      </div>
    </div>
  );

  // Topics Practiced Component
  const TopicsPracticed = () => (
    <div className="bg-gray-900/60 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Topics Practiced</h2>
      <div className="space-y-3">
        {userData.topicsPracticed.map((topic, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-300">{topic.name}</span>
            <span className="text-purple-400 font-semibold">{topic.solved} solved</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Languages Used Component
  const LanguagesUsed = () => (
    <div className="bg-gray-900/60 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <Code className="w-5 h-5 text-blue-400" />
        <span>Languages Used</span>
      </h2>
      <div className="space-y-3">
        {Object.entries(userData.submissionsByLanguage).map(([lang, count]) => (
          <div key={lang} className="flex justify-between items-center">
            <span className="text-gray-300 capitalize">{lang}</span>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-semibold">{count}</span>
              <div className="w-20 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full" 
                  style={{ width: `${(count / userData.overallStats.totalSubmissions) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Submission Verdicts Component
  const SubmissionVerdicts = () => (
    <div className="bg-gray-900/60 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Submission Verdicts</h2>
      <div className="space-y-2">
        {Object.entries(userData.submissionsByVerdict).map(([verdict, count]) => (
          <div key={verdict} className="flex justify-between items-center">
            <span className="text-gray-300">{verdict}</span>
            <div className="flex items-center space-x-2">
              <span className={`font-semibold ${getVerdictColor(verdict)}`}>{count}</span>
              <div className="w-16 bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getVerdictColor(verdict).replace('text-', 'bg-')}`}
                  style={{ width: `${(count / userData.overallStats.totalSubmissions) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Submission Activity Component
  const SubmissionActivity = () => (
    <div className="bg-gray-900/60 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <Calendar className="w-5 h-5 text-green-400" />
        <span>Recent Activity</span>
      </h2>
      <div className="space-y-2">
        {userData.submissionActivity.map((activity, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-300">{activity.date}</span>
            <span className="text-green-400 font-semibold">{activity.submissions} submissions</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Recent Submissions Component
  const RecentSubmissions = () => (
    <div className="bg-gray-900/60 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Recent Submissions</h2>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {userData.recentSubmissions.map((submission, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm text-gray-400">
                Problem: {submission.problemId.substring(0, 8)}...
              </div>
              <div className="text-xs text-gray-500">{submission.submitted}</div>
            </div>
            <div className="flex justify-between items-center">
              <span className={`font-semibold ${getVerdictColor(submission.verdict)}`}>
                {submission.verdict}
              </span>
              <span className="text-blue-400 text-sm">{submission.language}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Contest Statistics Component
  const ContestStats = () => (
    <div className="bg-gray-900/60 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <Award className="w-5 h-5 text-yellow-400" />
        <span>Contest Statistics</span>
      </h2>
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🚧</div>
        <div className="text-xl text-gray-400">Coming Soon</div>
        <div className="text-sm text-gray-500 mt-2">Contest feature is under development</div>
      </div>
    </div>
  );

  // Friends Component
  const Friends = () => (
    <div className="bg-gray-900/60 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <Users className="w-5 h-5 text-pink-400" />
        <span>Friends</span>
      </h2>
      <div className="max-h-80 overflow-y-auto space-y-3">
        {/* Mock friends data */}
        {[
          { name: "John Doe", solved: 45, rating: 1200 },
          { name: "Alice Smith", solved: 78, rating: 1500 },
          { name: "Bob Wilson", solved: 23, rating: 900 },
          { name: "Sarah Johnson", solved: 156, rating: 1800 },
          { name: "Mike Brown", solved: 89, rating: 1350 },
          { name: "Emma Davis", solved: 67, rating: 1250 },
          { name: "Tom Clark", solved: 34, rating: 1050 }
        ].map((friend, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">{friend.name}</div>
                  <div className="text-sm text-gray-400">{friend.solved} problems solved</div>
                </div>
              </div>
              <div className="text-purple-400 font-semibold">{friend.rating}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <ProfileHeader />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overall Statistics */}
            <OverallStats />
            
            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProblemsByDifficulty />
              <TopicsPracticed />
            </div>
            
            {/* Three Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <LanguagesUsed />
              <SubmissionVerdicts />
            </div>
            
            {/* Submission Activity */}
            <SubmissionActivity />
            
            {/* Recent Submissions */}
            <RecentSubmissions />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* Contest Statistics */}
            <ContestStats />
            
            {/* Friends */}
            <Friends />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;