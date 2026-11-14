import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../types";

// state ban dau : chua dang nhap
const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

// tao slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
    updateReLoginCode: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.reLoginCode = action.payload;
    },
  },
});

export const { loginSuccess, logout, updateReLoginCode} = authSlice.actions;
export default authSlice.reducer;
