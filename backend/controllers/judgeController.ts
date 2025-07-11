const dotenv = require("dotenv");
const Problem = require("../models/problem");
dotenv.config();
import axios from "axios";
import { response } from "express";
import { Mongoose } from "mongoose";
import test from "node:test";
const compilerBackendUrl =
  process.env.COMPILER_BACKEND_URL || "localhost:3000/run";

const addSubmissionToDatabase = async (
  userId: string,
  problemId: string,
  code: string,
  language: string,
  responseFromCompiler: any,
  verdict: string,
  correctTestCases: number,
  testcases: string[],
  testcaseOutputs: string[]
) => {
  const Submission = require("../models/submissions");
  let data = undefined;
  if (responseFromCompiler.status === "TimeLimitExceeded") {
    data = {
      userId,
      problemId,
      code,
      language,
      status: responseFromCompiler.status,
      verdict: "Time Limit Exceeded",
      totalTestCases: testcases.length,
      passedTestCases: correctTestCases,
    };
  }
  ///syntax error
  else if (responseFromCompiler.status === "compile_error") {
    data = {
      userId,
      problemId,
      code,
      language,
      status: responseFromCompiler.status,
      verdict: "Compilation Error",
      // compileError: {
      //   stderr: responseFromCompiler.stderr,
      // },
    };
  }
  //not sure when this appears
  else if (responseFromCompiler.status === "RuntimeError") {
    data = {
      userId,
      problemId,
      code,
      language,
      status: responseFromCompiler.status,
      verdict: "Runtime Error",
      // runTimeError: {
      //   message: responseFromCompiler.message,
      //   signal: responseFromCompiler.signal,
      //   stderr: responseFromCompiler.stderr,
      // },
    };
  } else if (verdict === "Not Accepted") {
    data = {
      userId,
      problemId,
      code,
      language,
      status: responseFromCompiler.status,
      verdict: "Wrong Answer",
      totalTestCases: testcases.length,
      passedTestCases: correctTestCases,
      failedTestCase: {
        input: testcases[correctTestCases],
        output: responseFromCompiler.outputs[correctTestCases],
        expectedOutput: testcaseOutputs[correctTestCases],
      },
    };
  } else if (verdict === "Accepted") {
    data = {
      userId,
      problemId,
      code,
      language,
      status: responseFromCompiler.status,
      verdict: "Accepted",
      totalTestCases: testcases.length,
      passedTestCases: correctTestCases,
      runtimeMs: responseFromCompiler.compilationTime,
      memoryKb: responseFromCompiler.timeTaken,
    };
  }

  // else if (responseFromCompiler.status === "Accepted") {
  const submission = new Submission(data);
  await submission.save();
};

export const judgeControl = async (req: any, res: any) => {
  let output = undefined;
  const { language, code, problemId } = req.body;

  const userIdNotformatted = req.body.userId;
  const userId = userIdNotformatted.trim().replace(/^"+|"+$/g, '');
  console.log("user id is what? : ", userId);
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
      await addSubmissionToDatabase(
        userId,
        problemId,
        code,
        language,
        responseFromCompiler,
        "Time Limit Exceeded",
        t,
        testcases,
        testcaseOutputs
      );
      console.log("submitted to database with Time Limit Exceeded");
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
        await addSubmissionToDatabase(
          userId,
          problemId,
          code,
          language,
          responseFromCompiler,
          "Accepted",
          t,
          testcases,
          testcaseOutputs
        );
        console.log("submitted to database with Accepted");
        return res.status(200).json({
          verdict: "Accepted",
          correctTestCases: t,
          responseFromCompiler,
        });
      } else {
        console.log("not all testcases are correct and t is ", t);
        await addSubmissionToDatabase(
          userId,
          problemId,
          code,
          language,
          responseFromCompiler,
          "Not Accepted",
          t,
          testcases,
          testcaseOutputs
        );
        console.log("submitted to database with Not Accepted");
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
