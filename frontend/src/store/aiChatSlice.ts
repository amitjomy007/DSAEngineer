import { createSlice } from "@reduxjs/toolkit";

interface chatObject {
    author: string;
    content: string;
}
interface chatStateType {
    chatHistory: chatObject[];
    code: string;
    language: string;
    problemDescription: string;
    problemTitle: string;
    problemExamples: {
        input: string;
        output: string;
        explanation: string;
    }
    error: string;
    //any other properties you might need
}

const initialState: chatStateType = {
  chatHistory: [],
  code: "",
  language: "", 
  problemDescription: "",
  problemTitle: "",
  problemExamples: 
  {
    input: "",
    output: "",
    explanation: "",
  },

  error: "",
};


const chatSlice = createSlice({
    name: "chat",
    // initialState: {
    //     // isAuthenticated: false,
    //     // email: null,
    //     // token: null,
    //     // // any other initial state properties
    // },
    initialState,
    reducers: {
        updateData(state: chatStateType, action){
            if(action.payload.code){
                state.code = action.payload.code
            }
            if(action.payload.language){
                state.language = action.payload.language
            }
            
        }
        updateLanguage(state: chatStateType, action){
            
        }
        updateChat (state: chatStateType, action){

        }
        login(state: AuthStateType, action) {
            state.isAuthenticated = true;
            state.email = action.payload.user.email;
            state.token = action.payload.user.token;
            //any other required logic
        },
        logout(state: AuthStateType) {
            state.isAuthenticated = false;
            state.email = null;
            state.token = null;
            //any other required logic
        }
        
    }
})



//export the interface  as well
export type { chatStateType };
export default authSlice.reducer;
