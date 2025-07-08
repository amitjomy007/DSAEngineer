import test from "node:test";
import executeCpp from "./languages/executeCpp";
//identifies the language and feeds to the right compiler util
const executeCode = async (
  filePath: string,
  testcaseDir: string,
  language: string
) => {
  let output = null;
  switch (language) {
    case "cpp":
      console.log("going to cpp ");
      output = await executeCpp(filePath, testcaseDir);
      console.log("Output was : ", output);
      break;
    // case "javascript":
    //     output = executeJavascript(filePath);
    //     break;
    // case "python":
    //     output = executePython(filePath);
    //     break;
    // case "c":
    //     output = executeC(filePath);
    //     break;
    // case "java":
    //     output = executeJava(filePath);
    //     break;
    default:
      output = executeCpp(filePath, testcaseDir);
      break;
  }
  return output;
};
export default executeCode;
