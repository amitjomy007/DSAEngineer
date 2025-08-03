import express from "express";
const router = express.Router();
import { addProblemControl } from "../controllers/problem/addProblemControl";

//Controller Imports
import { loginControl, registerControl } from "../controllers/authController";
import { judgeControl } from "../controllers/judgeController";
import { getProblemsControl } from "../controllers/problem/getProblemsControl";
import { getProblemControl } from "../controllers/problem/getProblemControl";
import { getSubmissionDetailsControl } from "../controllers/getSubmissionDetails";
import { getAllSubmissionsOfProblem } from "../controllers/getAllSubmissionsOfProblem";
import { handleVoteControl } from "../controllers/problem/handleVoteControl";
import { AiChatControl } from "../controllers/ai/aiChatcontroller";
import {
  addCommentControl,
  getCommentsControl,
  getRepliesControl,
  voteCommentControl,
} from "../controllers/comment/commentController";
import { getProfileDetails } from "../controllers/profile/profileDetailsController";
import { verifyJWTToken } from "../middlewares/verifyJwtToken";
import { smartLimiter } from "../middlewares/Rate Limiters/smartLimiter";
import { spamLimiter } from "../middlewares/Rate Limiters/spamLimiter";
import { getDashboard } from "../controllers/dashboard/dashboardController";
import { getRequestsData } from "../controllers/dashboard/pendingRequestsController";
import { getLogsData } from "../controllers/dashboard/auditController";
import { getUsersData } from "../controllers/dashboard/userController";
import { getProblemsData } from "../controllers/dashboard/problemsController";

import { 
  deleteProblem, 
  updateProblem,
  getEditProblem, 
  approveProblem, 
  rejectProblem 
} from "../controllers/dashboard/ACTIONS/problemActionsController";

import { 
  deleteUser, 
  getEditUser, 
  setUserRole, 
  promoteUser, 
  demoteUser 
} from "../controllers/dashboard/ACTIONS/userActionsController";

import { 
  approveRequest, 
  rejectRequest 
} from "../controllers/dashboard/ACTIONS/requestActionsController";

import { revertAuditAction } from "../controllers/dashboard/ACTIONS/auditActionsController";

// ✅ Import your existing RBAC
const { checkDashboardPermission } = require("../middlewares/RBAC/rbac");
// ✅ Simple RBAC middleware that works with your existing system
const requirePermission = (action: string) => {
  return (req: any, res: any, next: any) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const hasPermission = checkDashboardPermission(userRole, action, {
      targetUserId: req.body?.targetUserId || req.params?.userId,
      targetRole: req.body?.newRole || req.body?.targetRole
    });
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permission: ${action}`
      });
    }
    
    next();
  };
};

//Auth Routes
router.post("/login", spamLimiter(), smartLimiter(), loginControl);
router.post("/register", spamLimiter(), smartLimiter(), registerControl);
router.post(
  "/judge",
  spamLimiter(),
  smartLimiter(),
  verifyJWTToken,
  judgeControl
);

// ✅ Use existing RBAC permission
router.post("/addProblem", 
  smartLimiter(), 
  verifyJWTToken, 
  // requirePermission('create_problem'),
  addProblemControl
);

router.post(
  "/voteProblem",
  spamLimiter(),
  smartLimiter(),
  verifyJWTToken,
  handleVoteControl
);
router.post(
  "/aiChat",
  spamLimiter(),
  smartLimiter(),
  verifyJWTToken,
  AiChatControl
);

router.get("/problems", spamLimiter(), smartLimiter(), getProblemsControl);
router.get(
  "/getProblem/:slug",
  spamLimiter(),
  smartLimiter(),
  getProblemControl
);
router.get(
  "/getSubmissionDetails/:userId/:submissionId",
  spamLimiter(),
  smartLimiter(),
  getSubmissionDetailsControl
);
router.get(
  "/getAllSubmissionsOfProblem/:userId/:slug",
  spamLimiter(),
  smartLimiter(),
  getAllSubmissionsOfProblem
);

//comment routes
router.post(
  "/comments/addComment",
  spamLimiter(),
  smartLimiter(),
  verifyJWTToken,
  addCommentControl
);
router.post(
  "/comments/voteComment",
  spamLimiter(),
  smartLimiter(),
  verifyJWTToken,
  voteCommentControl
);
router.get("/getCommentsBySlug/:slug", getCommentsControl);
router.get("/comments/getReplies/:commentId", getRepliesControl);

//profile
router.get(
  "/profile/:userId",
  spamLimiter(),
  smartLimiter(),
  getProfileDetails
);

// ✅ Dashboard routes - just use verifyJWTToken, your controllers already have RBAC
router.get(
  "/dashboard",
  spamLimiter(),
  smartLimiter(),
  verifyJWTToken,
  getDashboard
);

router.get("/dashboard/requests", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  getRequestsData
);

router.get("/dashboard/logs", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  getLogsData
);

router.get("/dashboard/problems", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  getProblemsData
);

router.get("/dashboard/users",
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  getUsersData
);

// ✅ Problem actions - use your existing RBAC permissions
router.delete("/dashboard/problem/delete", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  requirePermission('delete_problem'),
  deleteProblem
);

router.put("/dashboard/problem/update", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  requirePermission('edit_any_problem'),
  updateProblem
);

router.get("/dashboard/problem/edit/:problemId", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  requirePermission('edit_any_problem'),
  getEditProblem
);

router.put("/dashboard/problem/approve", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  requirePermission('approve_problem'),
  approveProblem
);

router.put("/dashboard/problem/reject", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  requirePermission('reject_problem'),
  rejectProblem
);

// ✅ User actions - use your existing RBAC permissions
router.delete("/dashboard/user/delete", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  requirePermission('delete_user'),
  deleteUser
);

router.get("/dashboard/user/edit/:userId", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  requirePermission('manage_users'),
  getEditUser
);

router.put("/dashboard/user/setrole", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  requirePermission('set_user_role'),
  setUserRole
);

router.put("/dashboard/user/promote", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  requirePermission('promote_user'),
  promoteUser
);

router.put("/dashboard/user/demote", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  requirePermission('demote_user'),
  demoteUser
);

// ✅ Request actions - use your existing RBAC permissions
router.put("/dashboard/request/approve", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  requirePermission('approve_requests'),
  approveRequest
);

router.put("/dashboard/request/reject", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  requirePermission('reject_requests'),
  rejectRequest
);

// ✅ Audit actions - use your existing RBAC permissions
router.post("/dashboard/audit/revert", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken,
  requirePermission('revert_actions'),
  revertAuditAction
);

export default router;
