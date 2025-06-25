import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    user: string | null;
    //any other properties you might need
}

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        user: null,
        // any other initial state properties
    },
    reducers: {
        login(state: AuthState, action) {
            state.isAuthenticated = true;
            state.user = action.payload;
            //any other required logic
        },
        logout(state: AuthState) {
            state.isAuthenticated = false;
            state.user = null;
            //any other required logic
        }
        
    }
})


export default authSlice.reducer;