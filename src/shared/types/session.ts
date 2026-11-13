import type { User } from "./user";

// dung cho redux
export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

// dung de giu phien lam viec
export interface AuthSession {
  username: string;
  reLoginCode: string;
  expiresAt: number;
}

// request va response cua login
export interface LoginRequest {
    user: string;
    pass: string;
}

export interface LoginResponseData {
    RE_LOGIN_CODE: string;
}

// request va response cua reLogin
export interface ReLoginRequest {
  user: string;
  code: string;
}

export interface ReLoginResponseData {
  RE_LOGIN_CODE: string;
}

// request cua register
export interface RegisterRequest {
    user: string;
    pass: string;
}
