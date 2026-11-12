import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../../features/auth/slices/authSlice";
import messageReducer from "../../features/chat/message/slices/messageSlice";

// store
export const store = configureStore({
    reducer: {
        auth: authReducer, // them reducer o day
        message: messageReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
