const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// const identifyLanguageExtension = (language: string) => {
//   let languageExtension = "cpp";
//   switch (language) {
//     case "javascript":
//       languageExtension = "js";
//       break;
//     case "python":
//       languageExtension = "py";
//       break;
//     case "c":
//       languageExtension = "c";
//       break;
//     case "cpp":
//       languageExtension = "cpp";
//       break;
//     case "java":
//       languageExtension = "java";
//       break;
//     default:
//       languageExtension = "cpp";
//       break;
//   }
//   return languageExtension;
// };
const generateTestCaseFiles = (
  testcases: [{ input: string; output: string; id: string }],
  uniqueString: string
) => {
  const dirTestCase = path.join(__dirname, `./testcases/${uniqueString}`);
  if (!fs.existsSync(dirTestCase)) {
    fs.mkdirSync(dirTestCase, { recursive: true });
  }
  for (let i = 0; i < testcases.length; i++) {
    const txt = "txt";
    const fileName = `${i}.${txt}`;
    const filePath = path.join(dirTestCase, fileName);
    fs.writeFileSync(filePath, testcases[i].input);
  }

  return dirTestCase;
};
export default generateTestCaseFiles;
