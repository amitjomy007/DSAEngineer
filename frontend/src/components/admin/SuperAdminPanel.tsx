import { useState } from "react";
import {
  Filter,
  User,
  Shield,
  Crown,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
// import { Filter, Calendar, User, Shield, ShieldCheck, Crown, Eye, Edit, Ban, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const SuperAdminPanel = () => {
  const [userFilters, setUserFilters] = useState({
    role: "all",
    status: "all",
    search: "",
  });

  // Mock users data
  const users = [
    {
      id: 1,
      email: "john.doe@example.com",
      username: "johndoe",
      role: "user",
      status: "active",
      joinedDate: "2024-01-15",
      lastLogin: "2 hours ago",
      problemsSolved: 45,
      totalSubmissions: 120,
    },
    {
      id: 2,
      email: "jane.admin@example.com",
      username: "janeadmin",
      role: "admin",
      status: "active",
      joinedDate: "2023-12-10",
      lastLogin: "1 day ago",
      problemsSolved: 78,
      totalSubmissions: 200,
    },
    {
      id: 3,
      email: "mike.banned@example.com",
      username: "mikebanned",
      role: "user",
      status: "banned",
      joinedDate: "2024-02-20",
      lastLogin: "1 week ago",
      problemsSolved: 12,
      totalSubmissions: 25,
    },
    {
      id: 4,
      email: "sarah.super@example.com",
      username: "sarahsuper",
      role: "superadmin",
      status: "active",
      joinedDate: "2023-11-01",
      lastLogin: "30 minutes ago",
      problemsSolved: 156,
      totalSubmissions: 300,
    },
  ];

  // Mock escalated reports
  const escalatedReports = [
    {
      id: 1,
      problemId: 1,
      problemTitle: "Two Sum",
      reporterEmail: "user1@example.com",
      reporterUsername: "user1",
      message:
        "Test cases are incorrect, my solution should pass but it fails.",
      reportedDate: "2024-01-20",
      status: "escalated",
      priority: "high",
    },
    {
      id: 2,
      problemId: 3,
      problemTitle: "Longest Substring Without Repeating Characters",
      reporterEmail: "user2@example.com",
      reporterUsername: "user2",
      message: "Problem statement is ambiguous about edge cases.",
      reportedDate: "2024-01-18",
      status: "escalated",
      priority: "medium",
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "admin":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "user":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "superadmin":
        return <Crown className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "user":
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "banned":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "banned":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredUsers = users.filter((user) => {
    const roleMatch =
      userFilters.role === "all" || user.role === userFilters.role;
    const statusMatch =
      userFilters.status === "all" || user.status === userFilters.status;
    const searchMatch =
      userFilters.search === "" ||
      user.username.toLowerCase().includes(userFilters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(userFilters.search.toLowerCase());

    return roleMatch && statusMatch && searchMatch;
  });

  const handleUserAction = (userId: number, action: string) => {
    console.log(`Action ${action} for user ${userId}`);
    // Here you would implement the actual user management logic
  };

  const handleReportAction = (reportId: number, action: string) => {
    console.log(`Action ${action} for report ${reportId}`);
    // Here you would implement the actual report management logic
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center space-x-2">
          <Crown className="w-6 h-6 text-purple-400" />
          <span>Super Admin Panel</span>
        </h1>
        <p className="text-slate-400">
          Manage users, roles, and escalated reports
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-purple-600"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-purple-600"
          >
            Escalated Reports
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-purple-600"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* User Filters */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400 text-sm">Filters:</span>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-slate-400 text-sm">Role:</label>
                  <select
                    value={userFilters.role}
                    onChange={(e) =>
                      setUserFilters({ ...userFilters, role: e.target.value })
                    }
                    className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-slate-400 text-sm">Status:</label>
                  <select
                    value={userFilters.status}
                    onChange={(e) =>
                      setUserFilters({ ...userFilters, status: e.target.value })
                    }
                    className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-slate-400 text-sm">Search:</label>
                  <input
                    type="text"
                    placeholder="Search by username/email..."
                    value={userFilters.search}
                    onChange={(e) =>
                      setUserFilters({ ...userFilters, search: e.target.value })
                    }
                    className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[200px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Users ({filteredUsers.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-slate-300">User</TableHead>
                    <TableHead className="text-slate-300">Role</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">
                      Problems Solved
                    </TableHead>
                    <TableHead className="text-slate-300">Joined</TableHead>
                    <TableHead className="text-slate-300">Last Login</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-slate-700 hover:bg-slate-800/30"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">
                            {user.username}
                          </div>
                          <div className="text-sm text-slate-400">
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getRoleColor(user.role)} border`}
                        >
                          <div className="flex items-center space-x-1">
                            {getRoleIcon(user.role)}
                            <span className="capitalize">{user.role}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(user.status)} border`}
                        >
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(user.status)}
                            <span className="capitalize">{user.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {user.problemsSolved} / {user.totalSubmissions}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {user.joinedDate}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {user.lastLogin}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => handleUserAction(user.id, "view")}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-yellow-400 hover:text-yellow-300"
                            onClick={() => handleUserAction(user.id, "edit")}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={
                              user.status === "banned"
                                ? "text-green-400 hover:text-green-300"
                                : "text-red-400 hover:text-red-300"
                            }
                            onClick={() =>
                              handleUserAction(
                                user.id,
                                user.status === "banned" ? "unban" : "ban"
                              )
                            }
                          >
                            {user.status === "banned" ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Ban className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Escalated Reports Table */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>Escalated Reports ({escalatedReports.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-slate-300">Problem</TableHead>
                    <TableHead className="text-slate-300">Reporter</TableHead>
                    <TableHead className="text-slate-300">Priority</TableHead>
                    <TableHead className="text-slate-300">Message</TableHead>
                    <TableHead className="text-slate-300">Date</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {escalatedReports.map((report) => (
                    <TableRow
                      key={report.id}
                      className="border-slate-700 hover:bg-slate-800/30"
                    >
                      <TableCell>
                        <div className="font-medium text-purple-400">
                          {report.problemTitle}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">
                            {report.reporterUsername}
                          </div>
                          <div className="text-sm text-slate-400">
                            {report.reporterEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getPriorityColor(
                            report.priority
                          )} border`}
                        >
                          <span className="capitalize">{report.priority}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300 max-w-xs truncate">
                        {report.message}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {report.reportedDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-400 hover:text-green-300"
                            onClick={() =>
                              handleReportAction(report.id, "resolve")
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Resolve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() =>
                              handleReportAction(report.id, "investigate")
                            }
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Investigate
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {users.length}
                </div>
                <p className="text-xs text-green-400">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {users.filter((u) => u.status === "active").length}
                </div>
                <p className="text-xs text-green-400">+5% from last week</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Banned Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {users.filter((u) => u.status === "banned").length}
                </div>
                <p className="text-xs text-red-400">+2 this week</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Escalated Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {escalatedReports.length}
                </div>
                <p className="text-xs text-yellow-400">Requires attention</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminPanel;
