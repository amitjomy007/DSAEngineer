const dotenv = require("dotenv");
const Problem = require("../models/problem");
dotenv.config();
import axios from "axios";
import { Mongoose } from "mongoose";
import test from "node:test";
const compilerBackendUrl =
  process.env.COMPILER_BACKEND_URL || "localhost:3000/run";

export const judgeControl = async (req: any, res: any) => {
  let output = undefined;
  const { language, code, problemId, userId } = req.body;
  //console.log("req.body is : ", req.body);
  //   console.log(
  //     "received language, problemId and code are : ",
  //     language,
  //     problemId,
  //     code
  //   );
  let t = 0;
  try {
    //find the testcases corresponding to the problem id and get the testcaseOutputs from MongoDB
    // const {testcases, testcaseOutputs} =  from mongodb
    const { testcases } = await Problem.findById(problemId);
    const testcaseOutputs = testcases.map((testcase: any) => testcase.output);
    //console.log("testcaseOutputs is: ", testcaseOutputs);
    const payload = {
      language,
      code,
      testcases,
    };

    const response = await axios.post<string[]>(
      `http://${compilerBackendUrl}`,
      payload
    );
    // console.log("output is: ", output);
    //loop output
    const output = response.data;
    console.log("output is asdf : ", output);
    if (!output) {
      return res
        .status(400)
        .json({ message: "No output from compiler backend" });
    } else {
      for (let variable in output) {
        //console.log("testcaseOutputs[t] is: ", testcaseOutputs);
        if (testcaseOutputs[t] === output[t]) {
          t++;
        }
      }
      if (t === testcaseOutputs.length) {
        console.log("all testcases are correct");
        return res.status(200).json({ t, output });
      }
      return res.status(200).json({ t, output });
    }
  } catch (err) {
    console.log("Catched error in backend server: ", err);
    res.status(500).json(err, t, output);
  }

  return res.status(200).json({ t, output });
};
