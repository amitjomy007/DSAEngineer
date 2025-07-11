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
import { get } from "axios";
//Auth Routes
router.post("/login", loginControl);
router.post("/register", registerControl);
router.post("/judge", judgeControl);
router.post("/addProblem", addProblemControl);
router.post("/voteProblem", handleVoteControl);
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

export default router;
