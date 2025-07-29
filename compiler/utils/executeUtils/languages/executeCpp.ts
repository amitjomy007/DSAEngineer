import test from "node:test";

const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;

const dirOutput = path.join(__dirname, "../../../outputs");
if (!fs.existsSync(dirOutput)) {
  fs.mkdirSync(dirOutput, { recursive: true });
}

const generateExeFile = (codePath: string, outPath: string) => {
  const command = `g++ ${codePath} -o ${outPath}`;
  return new Promise((resolve, reject) => {
    exec(command, (err: any, stdout: any, stderr: any) => {
      if (err) {
        // Compilation failed - syntax errors, missing headers, etc.
          return reject({
          status: "CompileError",
          error: stderr.trim() || "Compilation error",
        });
      }
      resolve(stdout);
    });
  });
};
const runSingleTestCase = (
  inputPath: string,
  outPath: string,
  codePath: string,
  outputFileName: string
): any => {
  return new Promise((resolve, reject) => {
    //in windows ./ has to be removed (VERY IMPORTANT VERY IMPORTANT)
    const commmand = `${outputFileName} < ${inputPath}`;
    exec(
      commmand,
      { cwd: dirOutput, timeout: 2000, maxBuffer: 1024 * 1024 },
      (err: any, stdout: string, stderr: any) => {
        if (err) {
          // Check for timeout first - process killed by timeout or signal
          if (
            err.killed ||
            err.signal === "SIGTERM" ||
            err.message.includes("timed out")
          ) {
            return reject({
              status: "TimeLimitExceeded",
              error: "Process timed out after 2000ms",
            });
          }
          // Check for memory limit exceeded
          if (
            err.message.includes("maxBuffer") ||
            err.message.includes("ENOMEM")
          ) {
            return reject({
              status: "MemoryLimitExceeded",
              error: stderr || err.message,
            });
          }
          // Runtime error - segmentation fault, divide by zero, array out of bounds, etc.
          return reject({
            status: "RuntimeError",
            error: stderr || err.message,
          });
        }
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
  const outputFileName = `${jobId}.out`;
  const outPath = path.join(dirOutput, `${outputFileName}`);
  try {
    const files = fs.readdirSync(testcaseDir);
    const compilationTimeStart = Date.now();
    await generateExeFile(filePath, outPath);
    const compilationTime = Date.now() - compilationTimeStart;
    console.log("Took time to compile: ", compilationTime);
    let timeTaken = 0;
    for (const file of files) {
      const inputPath = path.join(testcaseDir, file);
      const start = Date.now();

      try {
        const output: any = await runSingleTestCase(
          inputPath,
          outPath,
          filePath,
          outputFileName
        );

        // Check if the result is a timeout status object instead of actual output
        if (
          typeof output === "object" &&
          output.status === "TimeLimitExceeded"
        ) {
          return {
            status: "TimeLimitExceeded",
            outputs,
            testcasesExecutedWithinLimits,
            compilationTime,
          };
        }

        timeTaken = Date.now() - start;
        // Secondary timeout check - if individual test case takes too long
        if (timeTaken > 1990) {
          return {
            status: "TimeLimitExceeded",
            outputs,
            testcasesExecutedWithinLimits,
            compilationTime,
          };
        }
        console.log("Took time: ", timeTaken);
        const formattedOutput = output.trim().split(/\r?\n/);
        outputs.push(formattedOutput[0]);
        testcasesExecutedWithinLimits++;
        //console.log("outputs is: ", outputs);
      } catch (executionError: any) {
        // Handle different types of execution errors properly
        if (executionError.status === "TimeLimitExceeded") {
          return {
            status: "TimeLimitExceeded",
            outputs,
            testcasesExecutedWithinLimits,
            compilationTime,
            error: executionError.error,
            failedTestcase: testcasesExecutedWithinLimits + 1,
          };
        } else if (executionError.status === "MemoryLimitExceeded") {
          return {
            status: "MemoryLimitExceeded",
            outputs,
            testcasesExecutedWithinLimits,
            compilationTime,
            error: executionError.error,
            failedTestcase: testcasesExecutedWithinLimits + 1,
          };
        } else if (executionError.status === "RuntimeError") {
          return {
            status: "RuntimeError",
            error: executionError.error,
            outputs,
            failedTestcase: testcasesExecutedWithinLimits + 1,
            testcasesExecutedWithinLimits,
            compilationTime,
          };
        } else {
          // Fallback for any other execution errors
          return {
            status: "RuntimeError",
            error: executionError,
            outputs,
            failedTestcase: testcasesExecutedWithinLimits + 1,
            testcasesExecutedWithinLimits,
            compilationTime,
          };
        }
      }
    }
    return {
      timeTaken: timeTaken, // time taken for the last test case
      memoryTaken: 256,
      status: "success",
      outputs,
      testcasesExecutedWithinLimits,
      compilationTime,
    };
  } catch (compilationError) {
    console.log("Caught compilation error: ", compilationError);
    return {
      status: "CompileError",
      error: compilationError,
      outputs,
      testcasesExecutedWithinLimits,
    };
  }
};

export default executeCpp;
