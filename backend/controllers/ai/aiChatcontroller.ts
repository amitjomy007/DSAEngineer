// import { GoogleGenAI } from "@google/genai";
// const dotenv = require("dotenv");
// dotenv.config();
// const GEMINI_API =
//   process.env.GEMINI_API || "AIzaSyBKWG76sDODRv4GJJT5lk_nEu0wJKSBJg4";
// const ai = new GoogleGenAI({ apiKey: GEMINI_API });
// export const AiChatControl = async (req: any, res: any) => {
//   const { code, language, chathistory, problemdescript, problemtitle } =
//   req.body;
//   try {
//     const response = await ai.models.generateContent({
//       model: "models/gemma-3-12b-it",
//       contents: "hello what is your name",
//     });
//     return res.status(200).json(response);
//   } catch (error) {
//     console.log(
//       "(catched) error occured while trying to upload to database: ",
//       error
//     );
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

import { GoogleGenAI } from "@google/genai";
const dotenv = require("dotenv");
dotenv.config();

// Security Warning: It's safer to not have a fallback key exposed in the code.
const GEMINI_API = process.env.GEMINI_API;
if (!GEMINI_API) {
  console.error("CRITICAL: GEMINI_API key not found in .env file.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API });

export const AiChatControl = async (req: any, res: any) => {
  // 1. Destructure all the necessary data from the request body
  const { code, language, chathistory, problemdescript, problemtitle } =
    req.body;

  // Basic validation to ensure required data is present
  if (!code || !language || !problemdescript || !problemtitle) {
    return res
      .status(400)
      .json({ message: "Missing required fields in request." });
  }

  try {
    // 2. Construct the detailed prompt for the AI tutor
    const latestUserPrompt = `
      You are an expert programming tutor. Your goal is to help a user solve a problem by giving hints, not the final answer.

      Here is the problem context:
      ---
      **Problem Title:** ${problemtitle}
      **Problem Description:**
      ${problemdescript}
      ---

      Here is my current code submission in ${language}:
      \`\`\`${language}
      ${code}
      \`\`\`

      Please analyze my code based on the problem description. Identify any potential bugs or logical errors. 
      Provide a concise, helpful hint or a guiding question to point me in the right direction. Do not give the complete solution.
    `;

    // 3. Prepare the 'contents' array for the API
    // This combines the existing conversation history with the new user prompt.
    const contents = [
      ...(chathistory || []), // Spread the existing history array
      { role: "user", parts: [{ text: latestUserPrompt }] }, // Add the new detailed prompt
    ];

    // 4. Call the Gemini API with the full conversation context
    const result = await ai.models.generateContent({
      model: "models/gemma-3-12b-it", // A fast and capable model for chat. Your "gemma-3-12b-it" is also fine.
      contents: contents, // Pass the combined history and new prompt
    });

    // 5. Extract only the useful text part from the AI's response
    // The full API response is very complex; this makes it easy for your frontend.
    const aiResponseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    // 6. Send the clean response back to the client
    return res.status(200).json({ aiResponse: aiResponseText });
  } catch (error) {
    console.error("Error occurred while calling the Gemini API: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
