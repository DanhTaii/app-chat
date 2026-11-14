export interface User {
  username: string;
  reLoginCode: string | null;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

export interface AuthSession {
  username: string;
  reLoginCode: string;
  expiresAt: number;
}

export interface LoginRequest {
  user: string;
  pass: string;
}

export interface LoginResponseData {
  RE_LOGIN_CODE: string;
}

export interface ReLoginRequest {
  user: string;
  code: string;
}

export interface ReLoginResponseData {
  RE_LOGIN_CODE: string;
}

export interface RegisterRequest {
  user: string;
  pass: string;
}
