import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./store"; // --- INTERFACES ---
import type { PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
interface ChatMessage {
  author: "user" | "bot";
  content: string;
}

interface ProblemExample {
  input: string;
  output: string;
  explanation?: string; // Optional as discussed
}

interface ChatState {
  chatHistory: ChatMessage[];
  code: string;
  language: string;
  problemTitle: string;
  problemDescription: string;
  problemExamples: ProblemExample[];
  promptsRemaining: number;
  isLoading: boolean;
  error: string | null;
}

// --- CONSTANTS AND INITIAL STATE ---

const MAX_PROMPTS = 5;

const initialState: ChatState = {
  chatHistory: [],
  code: "",
  language: "javascript",
  problemTitle: "",
  problemDescription: "",
  problemExamples: [],
  promptsRemaining: MAX_PROMPTS,
  isLoading: false,
  error: null,
};

// --- FIX #1: LOCAL TYPE FOR ROOTSTATE ---
// This creates a more specific type for use *only* within this file.
// It tells TypeScript that the global state will contain our `chat` slice.
type RootStateWithChat = RootState & { chat: ChatState };

// --- ASYNC THUNK FOR API CALL ---
// --- ASYNC THUNK FOR API CALL (Corrected Version) ---

export const sendPromptToAI = createAsyncThunk(
  "chat/sendPrompt",
  async (prompt: string, thunkAPI) => {
    // Use our new, more specific type to cast the state
    const state = thunkAPI.getState() as RootStateWithChat;
    
    // --- FIX #1: Get all required data from the Redux state ---
    // We need problemDescription to send to the backend.
    const {
      code,
      language,
      problemTitle,
      problemDescription, // <-- ADDED
      chatHistory,
    } = state.chat;

    const token = Cookies.get("token31d6cfe0d16ae931b73c59d7e0c089c0");

    if (!token) {
      return thunkAPI.rejectWithValue("Authentication token not found.");
    }

    // --- FIX #2: Transform chatHistory to the format the Gemini API expects ---
    const formattedHistory = chatHistory.map((message) => ({
      role: message.author === "bot" ? "model" : "user", // Convert 'author' to 'role'
      parts: [{ text: message.content }], // Wrap 'content' in 'parts' array
    }));

    // --- FIX #3: Build the payload with the CORRECT keys for the backend ---
    const payload = {
      code,
      language,
      problemtitle: problemTitle, // <-- FIXED: Changed key to lowercase
      problemdescript: problemDescription, // <-- FIXED: Added missing key
      chathistory: formattedHistory, // <-- FIXED: Changed key and using formatted data
    };
    // --- NO CHANGES NEEDED BELOW THIS LINE ---
    try {
      // NOTE: Make sure your backend route is '/aiChat' and not something else.
      const response = await axios.post(
        "http://localhost:8000/aiChat",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.aiResponse as string;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An AI error occurred.";
        return thunkAPI.rejectWithValue(errorMessage);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred.");
    }
  }
);

// --- THE SLICE ---

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Reducer to populate problem data when the page loads
    setProblemData(
      state,
      action: PayloadAction<{
        title: string;
        description: string;
        examples: ProblemExample[];
      }>
    ) {
      state.problemTitle = action.payload.title;
      state.problemDescription = action.payload.description;
      state.problemExamples = action.payload.examples;
    },
    // Reducer to update code from the editor
    updateCode(state, action: PayloadAction<string>) {
      state.code = action.payload;
    },
    // Reducer to update language from the dropdown
    updateLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    // Reducer to reset the chat state and prompt count
    resetChat(state) {
      state.chatHistory = [];
      state.promptsRemaining = MAX_PROMPTS;
      state.error = null;
      state.isLoading = false;
    },
  },
  // Handles the different states of our async thunk
  extraReducers: (builder) => {
    builder
      .addCase(sendPromptToAI.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        // Add the user's message to history immediately for a snappy UI
        state.chatHistory.push({ author: "user", content: action.meta.arg });
        state.promptsRemaining -= 1;
      })
      .addCase(
        sendPromptToAI.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          // Add the bot's successful response
          state.chatHistory.push({ author: "bot", content: action.payload });
        }
      )
      .addCase(sendPromptToAI.rejected, (state, action) => {
        state.isLoading = false;
        const errorMessage = action.payload as string;
        state.error = errorMessage;
        // Add a helpful error message directly to the chat history
        state.chatHistory.push({
          author: "bot",
          content: `Sorry, an error occurred: ${errorMessage}`,
        });
      });
  },
});

// --- EXPORTS ---

export const { setProblemData, updateCode, updateLanguage, resetChat } =
  chatSlice.actions;

export default chatSlice.reducer;

export type { ChatState, ChatMessage };
