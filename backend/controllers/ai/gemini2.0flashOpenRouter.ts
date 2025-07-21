// import OpenAI from "openai";
// const dotenv = require("dotenv");
// dotenv.config();
// const geminiFlash_2_0_OpenRouterAPI = process.env.GEMINI_FLASH_OPENROUTER_API;
// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: geminiFlash_2_0_OpenRouterAPI,
//   defaultHeaders: {
//     "HTTP-Referer": "<amitKasite>", // Optional. Site URL for rankings on openrouter.ai.
//     "X-Title": "<AkS>", // Optional. Site title for rankings on openrouter.ai.
//   },
// });

// const geminiFlash2_0 = async function main() {
//   const completion = await openai.chat.completions.create({
//     model: "google/gemini-2.0-flash-exp:free",
//     messages: [
//       {
//         role: "user",
//         content: "What is the meaning of life?",
//       },
//     ],
//   });
//   console.log(completion.choices[0].message);
// }

