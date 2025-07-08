const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const dirCode = path.join(__dirname, "../codes");
if (!fs.existsSync(dirCode)) {
  fs.mkdirSync(dirCode, { recursive: true });
}
const identifyLanguageExtension = (language: string) => {
  let languageExtension = "cpp";
  switch (language) {
    case "javascript":
      languageExtension = "js";
      break;
    case "python":
      languageExtension = "py";
      break;
    case "c":
      languageExtension = "c";
      break;
    case "cpp":
      languageExtension = "cpp";
      break;
    case "java":
      languageExtension = "java";
      break;
    default:
      languageExtension = "cpp";
      break;
  }
  return languageExtension;
};
const generateCodeFile = (language: string, code: string) => {
  const uniqueString = uuidv4();
  let languageExtension = identifyLanguageExtension(language);
  const fileName = `${uniqueString}.${languageExtension}`;
  const filePath = path.join(dirCode, fileName);
  fs.writeFileSync(filePath, code);
  return { filePath, uniqueString };
};
export default generateCodeFile;
