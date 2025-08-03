import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  createdAt: string;
  solvedProblems?: string[];
  attemptedProblems?: string[];
  bookmarkedProblems?: string[];
}

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  isApproved: boolean;
  problemCreatedDate: string;
  problemLastModifiedDate: string;
  problemAuthorId: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  };
  tags: string[];
  description: string;
}

interface PendingRequest {
  _id: string;
  requestType: string;
  requestedBy: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  };
  targetId: string;
  targetType: string;
  reason: string;
  status: string;
  createdAt: string;
  reviewedBy?: {
    firstname: string;
    lastname: string;
  };
  reviewedAt?: string;
}

interface AuditLog {
  _id: string;
  action: string;
  performedBy: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  };
  targetType: string;
  targetId: string;
  metadata: any;
  timestamp: string;
  reversible: boolean;
}

interface RoleConfig {
  defaultTab: string;
  availableTabs: string[];
  permissions: Record<string, boolean>;
}

interface DashboardData {
  user: User;
  roleConfig: RoleConfig;
  defaultTab: string;
  defaultTabData: any;
}

const DashboardRBAC: React.FC = () => {
  const Navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<string>("");
  const [tabData, setTabData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string>(""); // Track which action is loading

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  // Initial dashboard load
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/dashboard`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        const data = response.data.data;
        setDashboardData(data);
        setActiveTab(data.defaultTab);
        setTabData(data.defaultTabData);
      } else {
        setError("Failed to load dashboard");
      }
    } catch (error: any) {
      console.error("Dashboard load error:", error);
      setError(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Load specific tab data
  const loadTabData = async (tabName: string) => {
    if (tabName === activeTab && tabData) return;

    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/dashboard/${tabName}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setTabData(response.data.data);
        setActiveTab(tabName);
      } else {
        setError(`Failed to load ${tabName} data`);
      }
    } catch (error: any) {
      console.error(`Tab ${tabName} load error:`, error);
      setError(error.response?.data?.message || `Failed to load ${tabName}`);
    } finally {
      setLoading(false);
    }
  };

  // Show success message
  const showSuccess = (message: string) => {
    alert(`✅ SUCCESS: ${message}`);
  };

  // Show error message
  const showError = (message: string) => {
    alert(`❌ ERROR: ${message}`);
  };

  // Problem Actions
  const handleProblemDelete = async (
    problemId: string,
    problemTitle: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete "${problemTitle}"? This action will permanently remove it.`
      )
    )
      return;

    try {
      setActionLoading(`delete-problem-${problemId}`);
      const response = await axios.delete(
        `${backendUrl}/dashboard/problem/delete`,
        {
          data: { problemId },
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        showSuccess(`Problem "${problemTitle}" deleted successfully`);
        loadTabData(activeTab);
      }
    } catch (error: any) {
      showError("Failed to delete problem: " + error.response?.data?.message);
    } finally {
      setActionLoading("");
    }
  };

  const handleProblemEdit = async (problemId: string) => {
    try {
      setActionLoading(`edit-problem-${problemId}`);
      const response = await axios.get(
        `${backendUrl}/dashboard/problem/edit/${problemId}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // For now, just show the data - you can create an edit modal later
        console.log("Problem edit data:", response.data.data);
        showSuccess("Problem edit data loaded (check console)");
      }
    } catch (error: any) {
      showError(
        "Failed to load problem edit data: " + error.response?.data?.message
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleProblemApprove = async (
    problemId: string,
    problemTitle: string
  ) => {
    try {
      setActionLoading(`approve-problem-${problemId}`);
      const response = await axios.put(
        `${backendUrl}/dashboard/problem/approve`,
        {
          problemId,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        showSuccess(`Problem "${problemTitle}" approved successfully`);
        loadTabData(activeTab);
      }
    } catch (error: any) {
      showError("Failed to approve problem: " + error.response?.data?.message);
    } finally {
      setActionLoading("");
    }
  };

  const handleProblemReject = async (
    problemId: string,
    problemTitle: string
  ) => {
    const reason = prompt("Enter rejection reason (optional):");

    try {
      setActionLoading(`reject-problem-${problemId}`);
      const response = await axios.put(
        `${backendUrl}/dashboard/problem/reject`,
        {
          problemId,
          reason,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        showSuccess(`Problem "${problemTitle}" rejected successfully`);
        loadTabData(activeTab);
      }
    } catch (error: any) {
      showError("Failed to reject problem: " + error.response?.data?.message);
    } finally {
      setActionLoading("");
    }
  };

  // User Actions
  const handleUserDelete = async (targetUserId: string, userName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete user "${userName}"? This action is permanent!`
      )
    )
      return;

    try {
      setActionLoading(`delete-user-${targetUserId}`);
      const response = await axios.delete(
        `${backendUrl}/dashboard/user/delete`,
        {
          data: { targetUserId },
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        showSuccess(`User "${userName}" deleted successfully`);
        loadTabData(activeTab);
      }
    } catch (error: any) {
      showError("Failed to delete user: " + error.response?.data?.message);
    } finally {
      setActionLoading("");
    }
  };

  const handleUserEdit = async (targetUserId: string) => {
    try {
      setActionLoading(`edit-user-${targetUserId}`);
      const response = await axios.get(
        `${backendUrl}/dashboard/user/edit/${targetUserId}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log("User edit data:", response.data.data);
        showSuccess("User edit data loaded (check console)");
      }
    } catch (error: any) {
      showError(
        "Failed to load user edit data: " + error.response?.data?.message
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleUserSetRole = async (
    targetUserId: string,
    newRole: string,
    userName: string
  ) => {
    if (!confirm(`Change "${userName}" role to "${newRole}"?`)) return;

    try {
      setActionLoading(`setrole-user-${targetUserId}`);
      const response = await axios.put(
        `${backendUrl}/dashboard/user/setrole`,
        {
          targetUserId,
          newRole,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const message = response.data.data.requiresApproval
          ? `Role change request submitted for approval`
          : `User "${userName}" role changed to "${newRole}"`;
        showSuccess(message);
        loadTabData(activeTab);
      }
    } catch (error: any) {
      showError("Failed to set user role: " + error.response?.data?.message);
    } finally {
      setActionLoading("");
    }
  };

  const handleUserPromote = async (targetUserId: string, userName: string) => {
    if (!confirm(`Promote "${userName}" to next role level?`)) return;

    try {
      setActionLoading(`promote-user-${targetUserId}`);
      const response = await axios.put(
        `${backendUrl}/dashboard/user/promote`,
        {
          targetUserId,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const message = response.data.data.requiresApproval
          ? `Promotion request submitted for approval`
          : `User "${userName}" promoted successfully`;
        showSuccess(message);
        loadTabData(activeTab);
      }
    } catch (error: any) {
      showError("Failed to promote user: " + error.response?.data?.message);
    } finally {
      setActionLoading("");
    }
  };

  const handleUserDemote = async (targetUserId: string, userName: string) => {
    if (!confirm(`Demote "${userName}" to lower role level?`)) return;

    try {
      setActionLoading(`demote-user-${targetUserId}`);
      const response = await axios.put(
        `${backendUrl}/dashboard/user/demote`,
        {
          targetUserId,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const message =
          response.data.data.status === "pending_approval"
            ? `Demotion request submitted for approval`
            : `User "${userName}" demoted successfully`;
        showSuccess(message);
        loadTabData(activeTab);
      }
    } catch (error: any) {
      showError("Failed to demote user: " + error.response?.data?.message);
    } finally {
      setActionLoading("");
    }
  };

  // Request Actions
  const handleRequestApprove = async (
    requestId: string,
    requestType: string
  ) => {
    if (!confirm(`Approve this ${requestType.replace("_", " ")} request?`))
      return;

    try {
      setActionLoading(`approve-request-${requestId}`);
      const response = await axios.put(
        `${backendUrl}/dashboard/request/approve`,
        {
          requestId,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        showSuccess(
          `${requestType.replace("_", " ")} request approved and executed`
        );
        loadTabData(activeTab);
      }
    } catch (error: any) {
      showError("Failed to approve request: " + error.response?.data?.message);
    } finally {
      setActionLoading("");
    }
  };

  const handleRequestReject = async (
    requestId: string,
    requestType: string
  ) => {
    const rejectionReason = prompt("Enter rejection reason (optional):");

    try {
      setActionLoading(`reject-request-${requestId}`);
      const response = await axios.put(
        `${backendUrl}/dashboard/request/reject`,
        {
          requestId,
          rejectionReason,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        showSuccess(`${requestType.replace("_", " ")} request rejected`);
        loadTabData(activeTab);
      }
    } catch (error: any) {
      showError("Failed to reject request: " + error.response?.data?.message);
    } finally {
      setActionLoading("");
    }
  };

  // Audit Actions
  const handleAuditRevert = async (auditId: string, action: string) => {
    if (
      !confirm(
        `Are you sure you want to revert the "${action.replace(
          "_",
          " "
        )}" action? This will undo the original action.`
      )
    )
      return;

    try {
      setActionLoading(`revert-audit-${auditId}`);
      const response = await axios.post(
        `${backendUrl}/dashboard/audit/revert`,
        {
          auditId,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        showSuccess(
          `Action "${action.replace("_", " ")}" reverted successfully`
        );
        loadTabData(activeTab);
      }
    } catch (error: any) {
      showError("Failed to revert action: " + error.response?.data?.message);
    } finally {
      setActionLoading("");
    }
  };

  // Tab display names
  const getTabDisplayName = (tabName: string): string => {
    const names = {
      requests: "Pending Requests",
      logs: "Audit Logs",
      problems: "Problems",
      users: "Users",
      "add-problems": "Add Problems",
    };
    return names[tabName as keyof typeof names] || tabName;
  };

  // Check if action is loading
  const isActionLoading = (actionKey: string): boolean => {
    return actionLoading === actionKey;
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    if (loading) {
      return <div className={styles.loading}>Loading...</div>;
    }

    if (!tabData) {
      return <div className={styles.noData}>No data available</div>;
    }
  
    switch (activeTab) {
      case "requests":
        return renderRequestsTab();
      case "problems":
        return renderProblemsTab();
      case "add-problems":
     
        Navigate("/addProblem");
        return renderAddProblemsTab();
      case "users":
        return renderUsersTab();
      case "logs":
        return renderLogsTab();
      default:
        return <div>Tab not implemented</div>;
    }
  };

  const renderRequestsTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h3>Pending Requests</h3>
        {tabData.statistics && (
          <div className={styles.quickStats}>
            <span className={styles.statBadge}>
              Pending: {tabData.statistics.pendingRequests}
            </span>
            <span className={styles.statBadge}>
              Total: {tabData.statistics.totalRequests}
            </span>
          </div>
        )}
      </div>

      {tabData.requests?.length > 0 ? (
        <div className={styles.grid}>
          {tabData.requests.map((request: PendingRequest) => (
            <div key={request._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h4>{request.requestType.replace("_", " ").toUpperCase()}</h4>
                <span className={`${styles.status} ${styles[request.status]}`}>
                  {request.status}
                </span>
              </div>

              <div className={styles.cardContent}>
                <p>
                  <strong>Requested by:</strong> {request.requestedBy.firstname}{" "}
                  {request.requestedBy.lastname}
                </p>
                <p>
                  <strong>Role:</strong> {request.requestedBy.role}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
                {request.reason && (
                  <p>
                    <strong>Reason:</strong> {request.reason}
                  </p>
                )}

                {request.reviewedBy && (
                  <p>
                    <strong>Reviewed by:</strong> {request.reviewedBy.firstname}{" "}
                    {request.reviewedBy.lastname}
                  </p>
                )}
              </div>

              {request.status === "pending" && (
                <div className={styles.actionButtons}>
                  <button
                    className={`${styles.btn} ${styles.success}`}
                    onClick={() =>
                      handleRequestApprove(request._id, request.requestType)
                    }
                    disabled={isActionLoading(`approve-request-${request._id}`)}
                  >
                    {isActionLoading(`approve-request-${request._id}`)
                      ? "Approving..."
                      : "Approve"}
                  </button>
                  <button
                    className={`${styles.btn} ${styles.danger}`}
                    onClick={() =>
                      handleRequestReject(request._id, request.requestType)
                    }
                    disabled={isActionLoading(`reject-request-${request._id}`)}
                  >
                    {isActionLoading(`reject-request-${request._id}`)
                      ? "Rejecting..."
                      : "Reject"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No pending requests</p>
        </div>
      )}
    </div>
  );

  const renderProblemsTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h3>Problems Management</h3>
        {tabData.statistics && (
          <div className={styles.quickStats}>
            <span className={styles.statBadge}>
              Approved: {tabData.statistics.approvedProblems}
            </span>
            <span className={styles.statBadge}>
              Pending: {tabData.statistics.pendingProblems}
            </span>
            <span className={styles.statBadge}>
              Total: {tabData.statistics.totalProblems}
            </span>
          </div>
        )}
      </div>

      {tabData.problems?.length > 0 ? (
        <div className={styles.grid}>
          {tabData.problems.map((problem: Problem) => (
            <div key={problem._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h4>{problem.title}</h4>
                <span
                  className={`${styles.difficulty} ${
                    styles[problem.difficulty?.toLowerCase()]
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>

              <div className={styles.cardContent}>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={`${styles.status} ${
                      problem.isApproved ? styles.approved : styles.pending
                    }`}
                  >
                    {problem.isApproved ? "Approved" : "Pending"}
                  </span>
                </p>
                <p>
                  <strong>Author:</strong> {problem.problemAuthorId?.firstname}{" "}
                  {problem.problemAuthorId?.lastname}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(problem.problemCreatedDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Last Modified:</strong>{" "}
                  {new Date(
                    problem.problemLastModifiedDate
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Tags:</strong> {problem.tags?.join(", ") || "None"}
                </p>
              </div>

              <div className={styles.actionButtons}>
                <button
                  className={`${styles.btn} ${styles.primary}`}
                  onClick={() => handleProblemEdit(problem._id)}
                  disabled={isActionLoading(`edit-problem-${problem._id}`)}
                >
                  {isActionLoading(`edit-problem-${problem._id}`)
                    ? "Loading..."
                    : "Edit"}
                </button>

                {!problem.isApproved ? (
                  <>
                    <button
                      className={`${styles.btn} ${styles.success}`}
                      onClick={() =>
                        handleProblemApprove(problem._id, problem.title)
                      }
                      disabled={isActionLoading(
                        `approve-problem-${problem._id}`
                      )}
                    >
                      {isActionLoading(`approve-problem-${problem._id}`)
                        ? "Approving..."
                        : "Approve"}
                    </button>
                    <button
                      className={`${styles.btn} ${styles.warning}`}
                      onClick={() =>
                        handleProblemReject(problem._id, problem.title)
                      }
                      disabled={isActionLoading(
                        `reject-problem-${problem._id}`
                      )}
                    >
                      {isActionLoading(`reject-problem-${problem._id}`)
                        ? "Rejecting..."
                        : "Reject"}
                    </button>
                  </>
                ) : null}

                <button
                  className={`${styles.btn} ${styles.danger}`}
                  onClick={() =>
                    handleProblemDelete(problem._id, problem.title)
                  }
                  disabled={isActionLoading(`delete-problem-${problem._id}`)}
                >
                  {isActionLoading(`delete-problem-${problem._id}`)
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No problems found</p>
        </div>
      )}

      {tabData.pagination && (
        <div className={styles.paginationInfo}>
          <p>
            Page {tabData.pagination.currentPage} of{" "}
            {tabData.pagination.totalPages}({tabData.pagination.totalItems}{" "}
            total problems)
          </p>
        </div>
      )}
    </div>
  );

  const renderUsersTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h3>Users Management</h3>
        {tabData.statistics && (
          <div className={styles.quickStats}>
            <span className={styles.statBadge}>
              Super Admins: {tabData.statistics.superAdmins}
            </span>
            <span className={styles.statBadge}>
              Admins: {tabData.statistics.admins}
            </span>
            <span className={styles.statBadge}>
              Problem Setters: {tabData.statistics.problemSetters}
            </span>
            <span className={styles.statBadge}>
              Users: {tabData.statistics.regularUsers}
            </span>
          </div>
        )}
      </div>

      {tabData.users?.length > 0 ? (
        <div className={styles.grid}>
          {tabData.users.map((user: User) => (
            <div key={user._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h4>
                  {user.firstname} {user.lastname}
                </h4>
                <span className={`${styles.role} ${styles[user.role]}`}>
                  {user.role.replace("_", " ").toUpperCase()}
                </span>
              </div>

              <div className={styles.cardContent}>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Joined:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Solved Problems:</strong>{" "}
                  {user.solvedProblems?.length || 0}
                </p>
                <p>
                  <strong>Attempted Problems:</strong>{" "}
                  {user.attemptedProblems?.length || 0}
                </p>
                <p>
                  <strong>Bookmarked:</strong>{" "}
                  {user.bookmarkedProblems?.length || 0}
                </p>
              </div>

              <div className={styles.userRoleSection}>
                <label className={styles.roleLabel}>Change Role:</label>
                <select
                  className={styles.roleSelect}
                  value={user.role}
                  onChange={(e) =>
                    handleUserSetRole(
                      user._id,
                      e.target.value,
                      `${user.firstname} ${user.lastname}`
                    )
                  }
                  disabled={isActionLoading(`setrole-user-${user._id}`)}
                >
                  <option value="user">User</option>
                  <option value="problem_setter">Problem Setter</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className={styles.actionButtons}>
                <button
                  className={`${styles.btn} ${styles.primary}`}
                  onClick={() => handleUserEdit(user._id)}
                  disabled={isActionLoading(`edit-user-${user._id}`)}
                >
                  {isActionLoading(`edit-user-${user._id}`)
                    ? "Loading..."
                    : "Edit"}
                </button>

                <button
                  className={`${styles.btn} ${styles.success}`}
                  onClick={() =>
                    handleUserPromote(
                      user._id,
                      `${user.firstname} ${user.lastname}`
                    )
                  }
                  disabled={
                    isActionLoading(`promote-user-${user._id}`) ||
                    user.role === "super_admin"
                  }
                >
                  {isActionLoading(`promote-user-${user._id}`)
                    ? "Promoting..."
                    : "Promote"}
                </button>

                <button
                  className={`${styles.btn} ${styles.warning}`}
                  onClick={() =>
                    handleUserDemote(
                      user._id,
                      `${user.firstname} ${user.lastname}`
                    )
                  }
                  disabled={
                    isActionLoading(`demote-user-${user._id}`) ||
                    user.role === "user"
                  }
                >
                  {isActionLoading(`demote-user-${user._id}`)
                    ? "Demoting..."
                    : "Demote"}
                </button>

                <button
                  className={`${styles.btn} ${styles.danger}`}
                  onClick={() =>
                    handleUserDelete(
                      user._id,
                      `${user.firstname} ${user.lastname}`
                    )
                  }
                  disabled={isActionLoading(`delete-user-${user._id}`)}
                >
                  {isActionLoading(`delete-user-${user._id}`)
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No users found</p>
        </div>
      )}

      {tabData.pagination && (
        <div className={styles.paginationInfo}>
          <p>
            Page {tabData.pagination.currentPage} of{" "}
            {tabData.pagination.totalPages}({tabData.pagination.totalItems}{" "}
            total users)
          </p>
        </div>
      )}
    </div>
  );

  const renderLogsTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h3>Audit Logs</h3>
        {tabData.statistics && (
          <div className={styles.quickStats}>
            <span className={styles.statBadge}>
              Today: {tabData.statistics.todaysLogs}
            </span>
            <span className={styles.statBadge}>
              This Week: {tabData.statistics.thisWeekLogs}
            </span>
            <span className={styles.statBadge}>
              Reversible: {tabData.statistics.reversibleActions}
            </span>
          </div>
        )}
      </div>

      {tabData.logs?.length > 0 ? (
        <div className={styles.grid}>
          {tabData.logs.map((log: AuditLog) => (
            <div key={log._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h4>{log.action.replace("_", " ").toUpperCase()}</h4>
                {log.reversible && (
                  <span className={styles.reversibleBadge}>Reversible</span>
                )}
              </div>

              <div className={styles.cardContent}>
                <p>
                  <strong>Performed by:</strong> {log.performedBy?.firstname}{" "}
                  {log.performedBy?.lastname}
                </p>
                <p>
                  <strong>Role:</strong> {log.performedBy?.role}
                </p>
                <p>
                  <strong>Target:</strong> {log.targetType}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(log.timestamp).toLocaleString()}
                </p>

                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <div className={styles.metadataSection}>
                    <strong>Details:</strong>
                    <pre className={styles.metadata}>
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {log.reversible && (
                <div className={styles.actionButtons}>
                  <button
                    className={`${styles.btn} ${styles.warning}`}
                    onClick={() => handleAuditRevert(log._id, log.action)}
                    disabled={isActionLoading(`revert-audit-${log._id}`)}
                  >
                    {isActionLoading(`revert-audit-${log._id}`)
                      ? "Reverting..."
                      : "Revert Action"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No audit logs found</p>
        </div>
      )}
    </div>
  );

  const renderAddProblemsTab = () => (
    <div className={styles.tabContent}>
      <h3>Add New Problem</h3>
      <div className={styles.emptyState}>
        <p>Problem creation form will be implemented here</p>
        <button className={`${styles.btn} ${styles.primary}`}>
          + Create New Problem
        </button>
      </div>
    </div>
  );

  if (loading && !dashboardData) {
    return <div className={styles.dashboardLoading}>Loading dashboard...</div>;
  }

  if (error && !dashboardData) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div className={styles.error}>No dashboard data available</div>;
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <h1>Super Admin Dashboard</h1>
        <div className={styles.userInfo}>
          <span>
            Welcome, {dashboardData.user.firstname}{" "}
            {dashboardData.user.lastname}
          </span>
          <span
            className={`${styles.roleBadge} ${styles[dashboardData.user.role]}`}
          >
            {dashboardData.user.role.replace("_", " ").toUpperCase()}
          </span>
        </div>
      </header>

      <nav className={styles.tabs}>
        {dashboardData.roleConfig.availableTabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${
              activeTab === tab ? styles.active : ""
            }`}
            onClick={() => loadTabData(tab)}
          >
            {getTabDisplayName(tab)}
          </button>
        ))}
      </nav>

      <main className={styles.dashboardContent}>{renderTabContent()}</main>
    </div>
  );
};

export default DashboardRBAC;
