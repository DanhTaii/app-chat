import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "@/shared/types/session";
import type { User } from "@/shared/types/user";

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
    updateReLoginCode: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.reLoginCode = action.payload;
    },
  },
});

export const { loginSuccess, updateReLoginCode} = authSlice.actions;
export default authSlice.reducer;
