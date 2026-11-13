import chatSocket, { type SocketResponse } from "@/shared/services/socket/socketService";
import type { LoginRequest,LoginResponseData, ReLoginRequest, ReLoginResponseData, RegisterRequest } from "@/shared/types/session";

// register
export function register(params: RegisterRequest): Promise<SocketResponse<string>> {
    return chatSocket.request<string>("REGISTER", params);
}

// login
export function login(params: LoginRequest): Promise<SocketResponse<LoginResponseData>> {
    return chatSocket.request<LoginResponseData>("LOGIN", params);
}

// reLogin
export function reLogin(params: ReLoginRequest): Promise<SocketResponse<ReLoginResponseData>> {
    return chatSocket.request<ReLoginResponseData>("RE_LOGIN", params);
}

// logout
export function logout(): Promise<SocketResponse<string>> {
    return chatSocket.request<string>("LOGOUT", {});
}
