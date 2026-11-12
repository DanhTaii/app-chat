import chatSocket, { type SocketResponse } from "@/shared/services/socket/socketService";
import type { LoginRequest,LoginResponseData, ReLoginRequest, ReLoginResponseData } from "@/shared/types/session";

// login
export function login(params: LoginRequest): Promise<SocketResponse<LoginResponseData>> {
    return chatSocket.request<LoginResponseData>("LOGIN", params);
}

// reLogin
export function reLogin(params: ReLoginRequest): Promise<SocketResponse<ReLoginResponseData>> {
    return chatSocket.request<ReLoginResponseData>("RE_LOGIN", params);
}