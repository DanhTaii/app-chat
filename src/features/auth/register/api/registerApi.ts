import chatSocket, { type SocketResponse } from "@/shared/services/socket/socketService";
import type { RegisterRequest } from "../../types";

export function register(params: RegisterRequest): Promise<SocketResponse<string>> {
  return chatSocket.request<string>("REGISTER", params);
}
