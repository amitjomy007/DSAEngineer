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
        // Compilation failed
        return reject({
          status: "compile_error",
          errorMessage: stderr || err.message,
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
    const commmand = `${outputFileName} < ${inputPath}`;
    exec(
      commmand,
      { cwd: dirOutput },
      (err: any, stdout: string, stderr: any) => {
        if (err) {
          // Runtime crash, timeout, etc.
          return reject({
            status: "runtime_error",
            errorMessage: stderr || err.message,
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
  const outputFileName = `${jobId}.exe`;
  const outPath = path.join(dirOutput, `${outputFileName}`);
  try {
    const files = fs.readdirSync(testcaseDir);
    const compilationTimeStart = Date.now();
    await generateExeFile(filePath, outPath);
    const compilationTime = Date.now() - compilationTimeStart;
    console.log("Took time to compile: ", compilationTime);

    for (const file of files) {
      const inputPath = path.join(testcaseDir, file);
      const start = Date.now();
      try {
        const output: string = await runSingleTestCase(
          inputPath,
          outPath,
          filePath,
          outputFileName
        );
        const timeTaken = Date.now() - start;
        if (timeTaken > 1000) {
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
      } catch (runtimeError) {
        return {
          status: runtimeError,
          outputs,
          failedAtTestcase: file,
          testcasesExecutedWithinLimits,
          compilationTime,
        };
      }
    }
    return {
      status: "success",
      outputs,
      testcasesExecutedWithinLimits,
      compilationTime,
    };
  } catch (compilationError) {
    console.log("Catched error: ", compilationError);
    return { status: "compile_error", outputs, testcasesExecutedWithinLimits };
  }
};

export default executeCpp;
