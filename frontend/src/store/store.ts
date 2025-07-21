import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import chatReducer from "./aiChatSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer
    },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
