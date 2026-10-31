import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/slices/authSlice";

// store
export const store = configureStore({
  reducer: {
    auth: authReducer, // them reducer o day
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
