import { GoogleGenAI } from "@google/genai";
const dotenv = require("dotenv");
dotenv.config();
const GEMINI_API =
  process.env.GEMINI_API || "AIzaSyBKWG76sDODRv4GJJT5lk_nEu0wJKSBJg4";
const ai = new GoogleGenAI({ apiKey: GEMINI_API });
export const AiChatControl = async (req: any, res: any) => {
  const { code, language, chathistory, problemdescript, problemtitle } =
  req.body;
  try {
    const response = await ai.models.generateContent({
      model: "models/gemma-3-12b-it",
      contents: "hello what is your name",
    });
    return res.status(200).json(response);
  } catch (error) {
    console.log(
      "(catched) error occured while trying to upload to database: ",
      error
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
