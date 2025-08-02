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
router.post("/addProblem", smartLimiter(), verifyJWTToken, addProblemControl);
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
// Comment Routes
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

//profile and dashboard
router.get(
  "/profile/:userId",
  spamLimiter(),
  smartLimiter(),
  getProfileDetails
);

//dashboard
router.get(
  "/dashboard",
  spamLimiter(),
  smartLimiter(),
  verifyJWTToken,
  getDashboard
);

router.get("/dashboard/requests", getRequestsData);
router.get("/dashboard/logs", getLogsData);
router.get("/dashboard/problems", getProblemsData);
router.get("/dashboard/users",getUsersData);

//dashboard actions
// Add this import


// problem actions
router.delete("/dashboard/problem/delete", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken, 
  deleteProblem
);

router.get("/dashboard/problem/edit/:problemId", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken, 
  getEditProblem
);

router.put("/dashboard/problem/approve", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken, 
  approveProblem
);

router.put("/dashboard/problem/reject", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken, 
  rejectProblem
);

//user related 

router.delete("/dashboard/user/delete", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken, 
  deleteUser
);

router.get("/dashboard/user/edit/:userId", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken, 
  getEditUser
);

router.put("/dashboard/user/setrole", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken, 
  setUserRole
);

router.put("/dashboard/user/promote", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken, 
  promoteUser
);

router.put("/dashboard/user/demote", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken, 
  demoteUser
);

router.put("/dashboard/request/approve", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken, 
  approveRequest
);

router.put("/dashboard/request/reject", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken, 
  rejectRequest
);

router.post("/dashboard/audit/revert", 
  spamLimiter(), 
  smartLimiter(), 
  verifyJWTToken, 
  revertAuditAction
);



export default router;
