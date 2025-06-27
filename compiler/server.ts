const express = require("express");
import cors from "cors";
const dotenv = require("dotenv");
import generateFile from "./utils/fileGenerator";
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
  const { language, code } = req.body;
  console.log("language:", language);
  console.log("code:", code);
  try{
    const filePath = generateFile(language, code);
    const output = await executeCode(filePath, language);
    res.send(output);
  }catch(error){
    console.log("Error catched : ", error);
    res.send("Error running code in compiler: ", error);
  }
});
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
