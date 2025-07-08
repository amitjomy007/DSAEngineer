import { format } from "path";
import { stdout } from "process";

const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;

const dirOutput = path.join(__dirname, "../../../outputs");
if (!fs.existsSync(dirOutput)) {
  fs.mkdirSync(dirOutput, { recursive: true });
}

const runSingleTestCase = (
  inputPath: string,
  outPath: string,
  codePath: string,
  outputFileName: string
): any => {
  return new Promise((resolve, reject) => {
    const commmand = `g++ ${codePath} -o ${outPath} && cd ${dirOutput} && ${outputFileName} < ${inputPath}`;
    exec(commmand, (err: any, stdout: string, stderr: any) => {
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
    });
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
    for (const file of files) {
      const inputPath = path.join(testcaseDir, file);
      const output: string = await runSingleTestCase(
        inputPath,
        outPath,
        filePath,
        outputFileName
      );
      const formattedOutput = output.trim().split(/\r?\n/);
      outputs.push(formattedOutput[0]);
      testcasesExecutedWithinLimits++;
      //console.log("outputs is: ", outputs);
    }
  } catch (error) {
    console.log("Catched error: ", error);
    return outputs;
  }
  return outputs;
};

export default executeCpp;
