const express = require("express");
import cors from "cors";
const dotenv = require("dotenv");
import generateCodeFile from "./utils/codeFileGenerator";
import generateTestCaseFiles from "./testcaseFileGenerator";
import executeCode from "./utils/executeUtils/executeCode";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});

app.post("/run", async (req: any, res: any) => {
  const { language, code, testcases } = req.body;
  console.log("language:", language);
  console.log("code:", code);
  console.log("testcases:", testcases);
  // console.log("testcaseOutputs:", testcaseOutputs);

  try {
    //generates a single code file and return the exact path
    const { filePath, uniqueString } = generateCodeFile(language, code);
    //below fn generate testcase files and return the parent folder
    const testcaseDirPath = generateTestCaseFiles(testcases, uniqueString);
    const output = await executeCode(filePath, testcaseDirPath, language);
    res.status(200).json(output);
  } catch (error) {
    return res.status(500).json({
      status: "internal_error",
      message: error || "Error running code",
    });
  }
});
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
