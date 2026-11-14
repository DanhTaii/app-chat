import chatSocket, { type SocketResponse } from "@/shared/services/socket/socketService";
import type {
  ReLoginRequest,
  ReLoginResponseData,
} from "../../types";

export function reLogin(params: ReLoginRequest): Promise<SocketResponse<ReLoginResponseData>> {
  return chatSocket.request<ReLoginResponseData>("RE_LOGIN", params);
}

export function logout(): Promise<SocketResponse<string>> {
  return chatSocket.request<string>("LOGOUT", {});
}
