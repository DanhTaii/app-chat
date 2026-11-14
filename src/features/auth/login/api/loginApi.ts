import chatSocket, { type SocketResponse } from "@/shared/services/socket/socketService";
import type { LoginRequest, LoginResponseData } from "../../types";

export function login(params: LoginRequest): Promise<SocketResponse<LoginResponseData>> {
  return chatSocket.request<LoginResponseData>("LOGIN", params);
}
