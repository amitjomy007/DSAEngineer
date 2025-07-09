const dotenv = require("dotenv");
const Problem = require("../models/problem");
dotenv.config();
import axios from "axios";
import { response } from "express";
import { Mongoose } from "mongoose";
import test from "node:test";
const compilerBackendUrl =
  process.env.COMPILER_BACKEND_URL || "localhost:3000/run";

export const judgeControl = async (req: any, res: any) => {
  let output = undefined;
  const { language, code, problemId, userId } = req.body;
  let t = 0;
  try {
    //find the testcases corresponding to the problem id and get the testcaseOutputs from MongoDB
    // const {testcases, testcaseOutputs} =  from mongodb
    const { testcases } = await Problem.findById(problemId);
    const testcaseOutputs = testcases.map((testcase: any) => testcase.output);
    console.log("testcaseOutputs is: ", testcaseOutputs);
    //console.log("testcaseOutputs is: ", testcaseOutputs);
    const payload = {
      language,
      code,
      testcases,
    };

    const response = await axios.post<{
      outputs: string[];
      status: string;
      compilationTime: number;
      testcasesExecutedWithinLimits: number;
    }>(`http://${compilerBackendUrl}`, payload);
    // console.log("output is: ", output);
    //loop output

    const responseFromCompiler: {
      outputs: string[];
      status: string;
      compilationTime: number;
      testcasesExecutedWithinLimits: number;
    } = response.data;

    if (responseFromCompiler.status === "TimeLimitExceeded") {
      console.log(responseFromCompiler.status);
      return res
        .status(200)
        .json({ verdict: "Time Limit Exceeded", responseFromCompiler });
    }
    console.log("response from compiler is : ", responseFromCompiler);
    if (!responseFromCompiler) {
      return res
        .status(400)
        .json({ message: "No output from compiler backend" });
    } else {
      const outputs = responseFromCompiler.outputs;

      for (let i = 0; i < testcaseOutputs.length; i++) {
        if (testcaseOutputs[i] === outputs[i]) {
          t++;
        } else {
          break;
        }
        //console.log("output and testcaseOutputs[i] and i are: ", output, testcaseOutputs[i], i);
      }
      if (t === testcaseOutputs.length) {
        console.log("all testcases are correct");
        return res.status(200).json({
          verdict: "Accepted",
          correctTestCases: t,
          responseFromCompiler,
        });
      } else {
        console.log("not all testcases are correct and t is ", t);
        return res.status(200).send({
          verdict: "Not Accepted",
          correctTestCases: t,
          responseFromCompiler,
        });
      }
    }
  } catch (err) {
    console.log("Catched error in backend server: ", err);
    res.status(500).json({ msg: "failed to connect to compiler", err });
  }
};
