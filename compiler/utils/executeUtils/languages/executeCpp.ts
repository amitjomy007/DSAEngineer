import { format } from "path";
import { stdout } from "process";

const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;

const dirOutput = path.join(__dirname, "../../../outputs");
if (!fs.existsSync(dirOutput)) {
  fs.mkdirSync(dirOutput, { recursive: true });
}

const generateExeFile = (codePath: string, outPath: string) => {
  const commmand = `g++ ${codePath} -o ${outPath}`;
  const resultPromise = new Promise((resolve, reject) => {
    exec(commmand, (err: any, stdout: string, stderr: any) => {
      if (err) {
        //error appeared in the code written by us
        reject(err);
      }
      if (stderr) {
        //error appeared in the code written by the client (asdf.cpp for example)
        //this is not an error in the code written by us
        //console.error(`C++ compilation stderr: ${stderr}`);
        reject(new Error(`C++ compilation stderr: ${stderr}`));
        //return { message: "C++ compilation error", stderr };
      }
      console.log(`C++ compilation stdout: ${stdout}`);
      console.log("----------");
      resolve(stdout);
    });
  });
  resultPromise
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error;
    });
  return resultPromise;
};
const runSingleTestCase = (
  inputPath: string,
  outPath: string,
  codePath: string,
  outputFileName: string
): any => {
  return new Promise((resolve, reject) => {
    const commmand = `${outputFileName} < ${inputPath}`;
    exec(
      commmand,
      { cwd: dirOutput },
      (err: any, stdout: string, stderr: any) => {
        if (err) {
          //error appeared in the code written by us
          reject(err);
          return;
        }
        if (stderr) {
          //error appeared in the code written by the client (asdf.cpp for example)
          //this is not an error in the code written by us
          console.error(`C++ execution stderr: ${stderr}`);
          return { message: "C++ execution error", stderr };
        }
        console.log(`C++ execution stdout: ${stdout}`);
        console.log("----------");
        resolve(stdout);
      }
    );
  });
};
const executeCpp = async (filePath: string, testcaseDir: string) => {
  let outputs: string[] = [];
  let testcasesExecutedWithinLimits = 0;
  const lastString = path.basename(filePath);
  const [jobId] = lastString.split(".");
  const outputFileName = `${jobId}.exe`;
  const outPath = path.join(dirOutput, `${outputFileName}`);
  try {
    const files = fs.readdirSync(testcaseDir);
    const compilationTimeStart = Date.now();
    const compilerMessage = await generateExeFile(filePath, outPath);
    const compilationTime = Date.now() - compilationTimeStart;
    console.log("Took time to compile: ", compilationTime);
    console.log("Compiler said : ", compilerMessage);
    const start = Date.now();

    for (const file of files) {
      const inputPath = path.join(testcaseDir, file);
      const start = Date.now();
      const output: string = await runSingleTestCase(
        inputPath,
        outPath,
        filePath,
        outputFileName
      );
      const timeTaken = Date.now() - start;
      console.log("Took time: ", timeTaken);
      const formattedOutput = output.trim().split(/\r?\n/);
      outputs.push(formattedOutput[0]);
      testcasesExecutedWithinLimits++;
      //console.log("outputs is: ", outputs);
    }
  } catch (error) {
    console.log("Catched error: ", error);
    const data = { outputs, testcasesExecutedWithinLimits };
    return data;
  }
  const data = { outputs, testcasesExecutedWithinLimits };
  return data;
};

export default executeCpp;
