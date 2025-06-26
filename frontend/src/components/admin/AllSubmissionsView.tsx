import  { useState, useEffect } from 'react';
import { Filter, Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface AllSubmissionsViewProps {
  initialFilters?: {
    problemId?: number;
    problemTitle?: string;
  } | null;
}

const AllSubmissionsView = ({ initialFilters }: AllSubmissionsViewProps) => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProblem, setSelectedProblem] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  // Apply initial filters when component mounts or initialFilters change
  useEffect(() => {
    if (initialFilters?.problemId) {
      setSelectedProblem(initialFilters.problemId.toString());
    } else {
      setSelectedProblem('');
    }
  }, [initialFilters]);

  const allSubmissions = [
    {
      id: 1,
      problemId: 1,
      problemTitle: 'Two Sum',
      userEmail: 'john.doe@example.com',
      username: 'johndoe',
      status: 'Accepted',
      timeMs: 145,
      memoryKb: 2048,
      submittedAt: '2 hours ago',
      language: 'Python',
      code: `def two_sum(nums, target):
    hash_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hash_map:
            return [hash_map[complement], i]
        hash_map[num] = i
    return []`
    },
    {
      id: 2,
      problemId: 2,
      problemTitle: 'Add Two Numbers',
      userEmail: 'jane.smith@example.com',
      username: 'janesmith',
      status: 'Wrong Answer',
      timeMs: 89,
      memoryKb: 1024,
      submittedAt: '4 hours ago',
      language: 'JavaScript',
      code: `function addTwoNumbers(l1, l2) {
    let dummy = new ListNode(0);
    let current = dummy;
    let carry = 0;
    
    while (l1 || l2 || carry) {
        let sum = carry;
        if (l1) {
            sum += l1.val;
            l1 = l1.next;
        }
        if (l2) {
            sum += l2.val;
            l2 = l2.next;
        }
        
        carry = Math.floor(sum / 10);
        current.next = new ListNode(sum % 10);
        current = current.next;
    }
    
    return dummy.next;
}`
    },
    {
      id: 3,
      problemId: 3,
      problemTitle: 'Longest Substring Without Repeating Characters',
      userEmail: 'mike.wilson@example.com',
      username: 'mikew',
      status: 'Time Limit Exceeded',
      timeMs: 1000,
      memoryKb: 4096,
      submittedAt: '1 day ago',
      language: 'Java',
      code: `public class Solution {
    public int lengthOfLongestSubstring(String s) {
        int n = s.length();
        int maxLength = 0;
        
        for (int i = 0; i < n; i++) {
            Set<Character> seen = new HashSet<>();
            for (int j = i; j < n; j++) {
                if (seen.contains(s.charAt(j))) {
                    break;
                }
                seen.add(s.charAt(j));
                maxLength = Math.max(maxLength, j - i + 1);
            }
        }
        
        return maxLength;
    }
}`
    },
    {
      id: 4,
      problemId: 1,
      problemTitle: 'Two Sum',
      userEmail: 'sarah.johnson@example.com',
      username: 'sarahj',
      status: 'Compilation Error',
      timeMs: 0,
      memoryKb: 0,
      submittedAt: '2 days ago',
      language: 'C++',
      code: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {}; // Missing semicolon causes compilation error
    }
}`
    },
    {
      id: 5,
      problemId: 2,
      problemTitle: 'Add Two Numbers',
      userEmail: 'alex.brown@example.com',
      username: 'alexb',
      status: 'Accepted',
      timeMs: 78,
      memoryKb: 1536,
      submittedAt: '3 days ago',
      language: 'Python',
      code: `def addTwoNumbers(l1, l2):
    dummy = ListNode(0)
    current = dummy
    carry = 0
    
    while l1 or l2 or carry:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        digit = total % 10
        
        current.next = ListNode(digit)
        current = current.next
        
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    
    return dummy.next`
    }
  ];

  const problems = [
    { id: 1, title: 'Two Sum' },
    { id: 2, title: 'Add Two Numbers' },
    { id: 3, title: 'Longest Substring Without Repeating Characters' },
    { id: 4, title: 'Median of Two Sorted Arrays' },
    { id: 5, title: 'Longest Palindromic Substring' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'Wrong Answer':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'Time Limit Exceeded':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'Compilation Error':
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Wrong Answer':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Time Limit Exceeded':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Compilation Error':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredSubmissions = allSubmissions.filter(submission => {
    const statusMatch = selectedStatus === 'all' || submission.status === selectedStatus;
    const problemMatch = selectedProblem === '' || submission.problemId.toString() === selectedProblem;
    const userMatch = selectedUser === '' || 
      submission.username.toLowerCase().includes(selectedUser.toLowerCase()) ||
      submission.userEmail.toLowerCase().includes(selectedUser.toLowerCase());
    const languageMatch = selectedLanguage === '' || submission.language === selectedLanguage;
    
    return statusMatch && problemMatch && userMatch && languageMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">
          {initialFilters?.problemTitle ? `Submissions for ${initialFilters.problemTitle}` : 'All Submissions'}
        </h1>
        <p className="text-slate-400">
          {initialFilters?.problemTitle 
            ? `View all submissions for ${initialFilters.problemTitle}`
            : 'View and manage all submissions across all problems'
          }
        </p>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-sm">Filters:</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-slate-400 text-sm">Problem:</label>
              <select
                value={selectedProblem}
                onChange={(e) => setSelectedProblem(e.target.value)}
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Problems</option>
                {problems.map((problem) => (
                  <option key={problem.id} value={problem.id.toString()}>
                    {problem.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-slate-400 text-sm">Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All</option>
                <option value="Accepted">Accepted</option>
                <option value="Wrong Answer">Wrong Answer</option>
                <option value="Time Limit Exceeded">Time Limit Exceeded</option>
                <option value="Compilation Error">Compilation Error</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-slate-400 text-sm">Language:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Languages</option>
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-slate-400 text-sm">User:</label>
              <input
                type="text"
                placeholder="Search by username/email..."
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[200px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <span>Submissions ({filteredSubmissions.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800/50">
                <TableHead className="text-slate-300">Problem</TableHead>
                <TableHead className="text-slate-300">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>User</span>
                  </div>
                </TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Time</TableHead>
                <TableHead className="text-slate-300">Memory</TableHead>
                <TableHead className="text-slate-300">Language</TableHead>
                <TableHead className="text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Submitted</span>
                  </div>
                </TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id} className="border-slate-700 hover:bg-slate-800/30">
                  <TableCell>
                    <div className="font-medium text-purple-400">{submission.problemTitle}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{submission.username}</div>
                      <div className="text-sm text-slate-400">{submission.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(submission.status)} border`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(submission.status)}
                        <span>{submission.status}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {submission.status === 'Compilation Error' ? '-' : `${submission.timeMs}ms`}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {submission.status === 'Compilation Error' ? '-' : `${submission.memoryKb}KB`}
                  </TableCell>
                  <TableCell className="text-slate-300">{submission.language}</TableCell>
                  <TableCell className="text-slate-400">{submission.submittedAt}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                          <Eye className="w-4 h-4 mr-1" />
                          View Code
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white flex items-center space-x-2">
                            <span>Submission by {submission.username} - {submission.problemTitle}</span>
                            <Badge variant="outline" className={`${getStatusColor(submission.status)} border ml-2`}>
                              {submission.status}
                            </Badge>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">Language:</span>
                              <span className="text-white ml-2">{submission.language}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Time:</span>
                              <span className="text-white ml-2">
                                {submission.status === 'Compilation Error' ? '-' : `${submission.timeMs}ms`}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400">Memory:</span>
                              <span className="text-white ml-2">
                                {submission.status === 'Compilation Error' ? '-' : `${submission.memoryKb}KB`}
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-slate-300 font-medium mb-2">Source Code:</h4>
                            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                              <pre className="text-sm text-slate-300">
                                <code>{submission.code}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllSubmissionsView;
