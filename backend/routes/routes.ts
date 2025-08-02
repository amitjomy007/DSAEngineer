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

export default router;
