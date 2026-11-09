import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// khai bao kieu du lieu
interface User {
  username: string;
}

// data type cho chuc nang auth
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

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
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
