import { createSlice } from "@reduxjs/toolkit";

interface AuthStateType {
    isAuthenticated: boolean;
    user: string | null;
    token: string | null;
    //any other properties you might need
}

//redux should better be used for state management 
// using auth in redux is bad
//good examples are
//Problem filters/search state (while browsing)
//Temporary UI state (modal open, loading flags)

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        user: null,
        token: null,
        // any other initial state properties
    },
    reducers: {
        login(state: AuthStateType, action) {
            state.isAuthenticated = true;
            state.user = action.payload.user.email;
            state.token = action.payload.user.token;
            //any other required logic
        },
        logout(state: AuthStateType) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            //any other required logic
        }
        
    }
})



//export the interface  as well
export type { AuthStateType };
export default authSlice.reducer;
