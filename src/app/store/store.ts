import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/store/authSlice";
import messageReducer from "@/features/chat/message/store/messageSlice";
import conversationReducer from "@/features/chat/conversation/store/conversationSlice";
// store
export const store = configureStore({
    reducer: {
        auth: authReducer, // them reducer o day
        message: messageReducer,
        conversation: conversationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
