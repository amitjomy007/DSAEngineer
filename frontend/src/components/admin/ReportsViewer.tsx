
import { useState } from 'react';
import { AlertTriangle, CheckCircle, ArrowUp, Calendar, User, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

const ReportsViewer = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('');

  // Mock reports data
  const reports = [
    {
      id: 1,
      problemId: 1,
      problemTitle: 'Two Sum',
      reporterEmail: 'john.doe@example.com',
      reporterUsername: 'johndoe',
      reportType: 'incorrect-solution',
      message: 'The expected output for test case [2,7,11,15] with target 9 should be [0,1] but the system is accepting [1,0] as well. This might confuse students about the expected order.',
      status: 'pending',
      reportedAt: '2 hours ago',
      resolvedAt: null,
      resolvedBy: null
    },
    {
      id: 2,
      problemId: 3,
      problemTitle: 'Longest Substring Without Repeating Characters',
      reporterEmail: 'jane.smith@example.com',
      reporterUsername: 'janesmith',
      reportType: 'unclear-statement',
      message: 'The problem statement is ambiguous about how to handle empty strings. It should be explicitly mentioned what the expected output should be for an empty input.',
      status: 'resolved',
      reportedAt: '1 day ago',
      resolvedAt: '6 hours ago',
      resolvedBy: 'admin@example.com'
    },
    {
      id: 3,
      problemId: 2,
      problemTitle: 'Add Two Numbers',
      reporterEmail: 'mike.wilson@example.com',
      reporterUsername: 'mikew',
      reportType: 'test-case-issue',
      message: 'Test case #5 seems to have an incorrect expected output. My solution works for all other cases but fails on this one. I manually calculated and believe the expected result should be different.',
      status: 'escalated',
      reportedAt: '3 days ago',
      resolvedAt: null,
      resolvedBy: null
    },
    {
      id: 4,
      problemId: 1,
      problemTitle: 'Two Sum',
      reporterEmail: 'sarah.johnson@example.com',
      reporterUsername: 'sarahj',
      reportType: 'typo',
      message: 'There\'s a typo in the problem description. "retrun" should be "return" in the third paragraph.',
      status: 'resolved',
      reportedAt: '5 days ago',
      resolvedAt: '4 days ago',
      resolvedBy: 'admin@example.com'
    },
    {
      id: 5,
      problemId: 4,
      problemTitle: 'Median of Two Sorted Arrays',
      reporterEmail: 'alex.brown@example.com',
      reporterUsername: 'alexb',
      reportType: 'missing-constraints',
      message: 'The problem doesn\'t specify the time complexity requirement. It should mention that the solution should run in O(log(m+n)) time for students to understand the expected approach.',
      status: 'pending',
      reportedAt: '1 week ago',
      resolvedAt: null,
      resolvedBy: null
    }
  ];

  const reportTypes = [
    { value: 'incorrect-solution', label: 'Incorrect Expected Output' },
    { value: 'unclear-statement', label: 'Unclear Problem Statement' },
    { value: 'missing-constraints', label: 'Missing or Incorrect Constraints' },
    { value: 'test-case-issue', label: 'Test Case Issue' },
    { value: 'typo', label: 'Typo or Grammar Error' },
    { value: 'other', label: 'Other Issue' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'escalated':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertTriangle className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'escalated':
        return <ArrowUp className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleMarkAsResolved = (reportId: number) => {
    console.log('Marking report as resolved:', reportId);
    // Here you would typically update the report status in your backend
  };

  const handleEscalate = (reportId: number) => {
    console.log('Escalating report:', reportId);
    // Here you would typically escalate the report to super admin
  };

  const filteredReports = reports.filter(report => {
    const statusMatch = selectedStatus === 'all' || report.status === selectedStatus;
    const typeMatch = selectedType === '' || report.reportType === selectedType;
    return statusMatch && typeMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Problem Reports</h1>
        <p className="text-slate-400">Manage and review problem reports from users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-yellow-400 text-sm font-medium">Pending</p>
                <p className="text-white text-xl font-bold">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-green-400 text-sm font-medium">Resolved</p>
                <p className="text-white text-xl font-bold">
                  {reports.filter(r => r.status === 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <ArrowUp className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-red-400 text-sm font-medium">Escalated</p>
                <p className="text-white text-xl font-bold">
                  {reports.filter(r => r.status === 'escalated').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-sm">Filters:</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-slate-400 text-sm">Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-slate-400 text-sm">Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Types</option>
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Reports ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800/50">
                <TableHead className="text-slate-300">Problem</TableHead>
                <TableHead className="text-slate-300">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Reporter</span>
                  </div>
                </TableHead>
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Message</TableHead>
                <TableHead className="text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Reported</span>
                  </div>
                </TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id} className="border-slate-700 hover:bg-slate-800/30">
                  <TableCell>
                    <div className="font-medium text-purple-400">{report.problemTitle}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{report.reporterUsername}</div>
                      <div className="text-sm text-slate-400">{report.reporterEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-300 text-sm">
                      {reportTypes.find(t => t.value === report.reportType)?.label || report.reportType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(report.status)} border`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(report.status)}
                        <span className="capitalize">{report.status}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-slate-300 text-sm truncate" title={report.message}>
                        {report.message}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-400">{report.reportedAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {report.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsResolved(report.id)}
                            className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Resolve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEscalate(report.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            <ArrowUp className="w-4 h-4 mr-1" />
                            Escalate
                          </Button>
                        </>
                      )}
                      {report.status === 'resolved' && (
                        <span className="text-green-400 text-sm">
                          Resolved by {report.resolvedBy} {report.resolvedAt}
                        </span>
                      )}
                      {report.status === 'escalated' && (
                        <span className="text-red-400 text-sm">Escalated to Super Admin</span>
                      )}
                    </div>
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

export default ReportsViewer;
