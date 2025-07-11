const dotenv = require("dotenv");
const Problem = require("../models/problem");
dotenv.config();
const Submission = require("../models/submissions");
import axios from "axios";
import { response } from "express";
import { Mongoose } from "mongoose";
import test from "node:test";
const compilerBackendUrl =
  process.env.COMPILER_BACKEND_URL || "localhost:3000/run";

export const getAllSubmissionsOfProblem = async (req: any, res: any) => {
  try {
    const slug = req.params.slug;
    console.log("slug is: ", slug);
    const userId = req.params.userId;
    const problem = await Problem.findOne({
      titleSlug: slug,
    });
    console.log("problem is: ", problem);
    const problemId = problem._id;
    console.log("user id and problemId is : ", userId, problemId);
    const submissions = await Submission.find({
      problemId: problemId,
      userId: userId,
    }).sort({ createdAt: -1 });
    console.log("received submissions: ", submissions);
    if (!submissions) {
      return res.status(404).json({ message: "Submission not found" });
    }
    return res.status(200).json(submissions);
  } catch (error) {
    console.log(
      "(catched) error occured while trying to upload to database: ",
      error
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
