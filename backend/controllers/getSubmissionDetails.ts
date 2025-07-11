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

export const getSubmissionDetailsControl = async (req: any, res: any) => {
    try{
            const submissionId = req.params.submissionId;
            const userId = req.params.userId;
            const problemId = req.params.problemId;
            const submissionDetail = await Submission.findById(submissionId);
            if (!submissionDetail) {
                return res.status(404).json({ message: "Submission not found" });
            }
            return res.status(200).json(submissionDetail);
    } catch (error) {
        console.log("(catched) error occured while trying to upload to database: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
