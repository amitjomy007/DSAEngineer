const dotenv = require("dotenv");
const Problem = require("../models/problem");
dotenv.config();
import axios from "axios";
import { error } from "console";
import { response } from "express";
import { Mongoose } from "mongoose";
import test, { run } from "node:test";
const compilerBackendUrl =  process.env.COMPILER_BACKEND_URL || "localhost:3000/run";
console.log("process", process.env.COMPILER_BACKEND_URL)
type SubmissionData = {
  userId: string;
  problemId: string;
  code: string;
  language: string;
  responseFromCompiler: any;
  status: string;
  verdict: string;
  error: string;
  testcases: string[];
  testcaseOutputs: string[];
  correctTestCases: number;
};

// Standardized response interface for frontend
interface JudgeResponse {
  verdict: string;
  correctTestCases?: number;
  responseFromCompiler: any;
  error?: string;
}

const addSubmissionToDatabase = async (Arg: SubmissionData) => {
  let data = undefined;
  data = {
    userId: Arg.userId,
    problemId: Arg.problemId,
    code: Arg.code,
    language: Arg.language,
    status: Arg.responseFromCompiler.status,
    verdict: Arg.verdict,
    error: JSON.stringify(Arg.error),
    totalTestCases: Arg.testcases.length,
    passedTestCases: Arg.correctTestCases,
  };

  // Add specific fields based on verdict type
  if (Arg.verdict === "Not Accepted") {
    data = {
      ...data,
      failedTestCase: {
        input: Arg.testcases[Arg.correctTestCases],
        output: Arg.responseFromCompiler.outputs[Arg.correctTestCases],
        expectedOutput: Arg.testcaseOutputs[Arg.correctTestCases],
      },
    };
  } else if (Arg.verdict === "Accepted") {
    data = {
      ...data,
      runtimeMs: Arg.responseFromCompiler.timeTaken,
      memoryKb: 256,
    };
  }

  const Submission = require("../models/submissions");
  console.log("data putting in db: ", data);
  if(data.error && typeof data.error!='string'){
    data.error = JSON.stringify(error)
  }
  const submission = new Submission(data);
  await submission.save();
  console.log("saved submission: ", submission);
};

export const judgeControl = async (req: any, res: any) => {
  const { language, code, problemId } = req.body;
  const userIdNotformatted = req.body.userId;
  let userId = undefined;
  try{
    userId = userIdNotformatted.trim().replace(/^"+|"+$/g, "");
  }
  catch(err){
    console.log("errah, no userId received from request, aborting this request...")
    res.status(400).send({ error: "Missing or invalid userId in request." });
    res.send()
    return ;
  }
  

  try {
    // Find the testcases corresponding to the problem id and get the testcaseOutputs from MongoDB
    const problemData = await Problem.findById(problemId);
    if (!problemData) {
      return res.status(404).json({
        verdict: "Error",
        error: "Problem not found",
        responseFromCompiler: null,
      });
    }

    const { testcases } = problemData;
    const testcaseOutputs = testcases.map((testcase: any) => testcase.output);

    const payload = {
      language,
      code,
      testcases,
    };

    // Make request to compiler backend
    console.log("About to make axios request");
    
    const response = await axios.post<{
      outputs: string[];
      status: string;
      compilationTime: number;
      timeTaken: number;
      error: string;
      testcasesExecutedWithinLimits: number;
    }>(`http://${compilerBackendUrl}`, payload);

    console.log("response.data is: ", response.data);
    const responseFromCompiler = response.data;
    console.log( "response from compiler: ", responseFromCompiler)

    if (!responseFromCompiler) {
      return res.status(500).json({
        verdict: "Error",
        error: "Compiler server returned empty response",
        responseFromCompiler: null,
      });
    }

    // Base data structure for database
    const baseData = {
      userId: userId,
      problemId: problemId,
      code: code,
      language: language,
      responseFromCompiler: responseFromCompiler,
      status: responseFromCompiler.status,
      testcases: testcases,
      testcaseOutputs: testcaseOutputs,
      correctTestCases: 0,
    };

    // Handle different compiler response statuses
    switch (responseFromCompiler.status) {
      case "CompileError":
      case "compile_error": // Handle both old and new status names
        const compileErrorData = {
          ...baseData,
          error: responseFromCompiler.error || "Compilation failed",
          verdict: "Compilation Error",
        };
        await addSubmissionToDatabase(compileErrorData);
        console.log("Submitted to database with Compilation Error");
        return res.status(200).json({
          verdict: "Compilation Error",
          responseFromCompiler,
          error: responseFromCompiler.error,
        });

      case "RuntimeError":
      case "runtimeError": // Handle both old and new status names
        const runTimeOutputs = responseFromCompiler.outputs || [];
        let correctTestCasesrunTime = 0;
        for (
          let i = 0;
          i < runTimeOutputs.length && i < testcaseOutputs.length;
          i++
        ) {
          if (testcaseOutputs[i] === runTimeOutputs[i]) {
            correctTestCasesrunTime++;
          } else {
            break;
          }
        }
        const runtimeErrorData = {
          ...baseData,
          correctTestCases: correctTestCasesrunTime,
          error: responseFromCompiler.error || "Runtime error occurred",
          verdict: "Runtime Error",
        };

        await addSubmissionToDatabase(runtimeErrorData);
        console.log("Submitted to database with Runtime Error");
        return res.status(200).json({
          verdict: "Runtime Error",
          responseFromCompiler,
          error: responseFromCompiler.error,
        });

      case "TimeLimitExceeded":
        // Manually check how many outputs were correct before timeout
        const timeoutOutputs = responseFromCompiler.outputs || [];
        let correctTestCasesTimeout = 0;
        for (
          let i = 0;
          i < timeoutOutputs.length && i < testcaseOutputs.length;
          i++
        ) {
          if (testcaseOutputs[i] === timeoutOutputs[i]) {
            correctTestCasesTimeout++;
          } else {
            break;
          }
        }

        const timeoutData = {
          ...baseData,
          correctTestCases: correctTestCasesTimeout,
          error: responseFromCompiler.error || "Time limit exceeded",
          verdict: "Time Limit Exceeded",
        };
        await addSubmissionToDatabase(timeoutData);
        console.log("Submitted to database with Time Limit Exceeded");
        return res.status(200).json({
          verdict: "Time Limit Exceeded",
          correctTestCases: correctTestCasesTimeout,
          responseFromCompiler,
          error: responseFromCompiler.error,
        });

      case "MemoryLimitExceeded":
        // Manually check how many outputs were correct before memory limit
        const memoryOutputs = responseFromCompiler.outputs || [];
        let correctTestCasesMemory = 0;
        for (
          let i = 0;
          i < memoryOutputs.length && i < testcaseOutputs.length;
          i++
        ) {
          if (testcaseOutputs[i] === memoryOutputs[i]) {
            correctTestCasesMemory++;
          } else {
            break;
          }
        }

        const memoryErrorData = {
          ...baseData,
          correctTestCases: correctTestCasesMemory,
          error: responseFromCompiler.error || "Memory limit exceeded",
          verdict: "Memory Limit Exceeded",
        };
        await addSubmissionToDatabase(memoryErrorData);
        console.log("Submitted to database with Memory Limit Exceeded");
        return res.status(200).json({
          verdict: "Memory Limit Exceeded",
          correctTestCases: correctTestCasesMemory,
          responseFromCompiler,
          error: responseFromCompiler.error,
        });

      case "success":
        // Compare outputs with expected outputs
        const outputs = responseFromCompiler.outputs;
        let correctTestCases = 0;

        for (let i = 0; i < testcaseOutputs.length; i++) {
          if (i < outputs.length && testcaseOutputs[i] === outputs[i]) {
            correctTestCases++;
          } else {
            break;
          }
        }

        const successData = {
          ...baseData,
          correctTestCases: correctTestCases,
        };

        if (correctTestCases === testcaseOutputs.length) {
          const acceptedData = {
            ...successData,
            verdict: "Accepted",
            error: "NONE",
          };
          await addSubmissionToDatabase(acceptedData);
          console.log("Submitted to database with Accepted");
          return res.status(200).json({
            verdict: "Accepted",
            correctTestCases: correctTestCases,
            responseFromCompiler,
          });
        } else {
          const notAcceptedData = {
            ...successData,
            verdict: "Wrong Answer",
            error: "NONE",
          };
          await addSubmissionToDatabase(notAcceptedData);
          console.log(
            "Submitted to database with Not Accepted (disguised wrong answer"
          );
          return res.status(200).json({
            verdict: "Not Accepted/disguised Wrong Answer",
            correctTestCases: correctTestCases,
            responseFromCompiler,
          });
        }

      default:
        // Handle unknown status from compiler
        console.log("Unknown compiler status:", responseFromCompiler.status);
        const unknownErrorData = {
          ...baseData,
          error: `Unknown compiler status: ${responseFromCompiler.status}`,
          verdict: "Error",
        };
        await addSubmissionToDatabase(unknownErrorData);
        return res.status(200).json({
          verdict: "Error",
          responseFromCompiler,
          error: `Unknown compiler status: ${responseFromCompiler.status}`,
        });
    }
  } catch (err: any) {
    console.log("Caught error in backend server:", err);

    // Handle axios errors specifically
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      return res.status(503).json({
        verdict: "Error",
        error: "Compiler server is unavailable. Please try again later.",
        responseFromCompiler: null,
      });
    }

    // Handle axios timeout
    if (err.code === "ECONNABORTED") {
      return res.status(504).json({
        verdict: "Error",
        error: "Compiler server request timed out. Please try again.",
        responseFromCompiler: null,
      });
    }

    // Handle database errors
    if (err.name === "MongoError" || err.name === "ValidationError") {
      return res.status(500).json({
        verdict: "Error",
        error: "Database error occurred. Please try again.",
        responseFromCompiler: null,
      });
    }

    // Generic error handler
    return res.status(500).json({
      verdict: "Error",
      error: "An unexpected error occurred. Please try again.",
      responseFromCompiler: null,
    });
  }
};
