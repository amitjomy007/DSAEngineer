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
//Auth Routes
router.post("/login", loginControl);
router.post("/register", registerControl);
router.post("/judge", verifyJWTToken,judgeControl);
router.post("/addProblem",verifyJWTToken, addProblemControl);
router.post("/voteProblem",verifyJWTToken, handleVoteControl);
router.post("/aiChat",verifyJWTToken, AiChatControl);

router.get("/problems", getProblemsControl);
router.get("/getProblem/:slug", getProblemControl);
router.get(
  "/getSubmissionDetails/:userId/:submissionId",
  getSubmissionDetailsControl
);
router.get(
  "/getAllSubmissionsOfProblem/:userId/:slug",
  getAllSubmissionsOfProblem
);

//comment routes
// Comment Routes
router.post("/comments/addComment",verifyJWTToken, addCommentControl);
router.post("/comments/voteComment",verifyJWTToken, voteCommentControl);
router.get("/getCommentsBySlug/:slug", getCommentsControl);
router.get("/comments/getReplies/:commentId", getRepliesControl);

//profile and dashboard
router.get("/profile/:userId", getProfileDetails);

export default router;
