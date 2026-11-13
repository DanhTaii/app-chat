import chatSocket, {type SocketResponse} from "@/shared/services/socket/socketService.ts";
import type {
    GetPeopleChatMessRequest,
    GetPeopleChatMessResponse, GetRoomChatMessRequest, GetRoomChatMessResponse,
    SendPeopleChatRequest, SendRoomChatRequest
} from "@/features/chat/message/types.ts";

export async function findListMessage(params: GetPeopleChatMessRequest): Promise<SocketResponse<GetPeopleChatMessResponse>> {
    try {
        return await chatSocket.request<GetPeopleChatMessResponse>(
            "GET_PEOPLE_CHAT_MES",
            params
        );

    } catch (error) {
        console.error("Socket testing failed:", error);
        throw error;
    }
}

export function sendMessageSingle(params: SendPeopleChatRequest) {
    try {
        return chatSocket.send(
            "SEND_CHAT",
            params
        )
    } catch (e) {
        console.error("Socket testing failed:", e);
        throw e;
    }
}

export async function findGroupListMessage(params: GetRoomChatMessRequest): Promise<SocketResponse<GetRoomChatMessResponse>> {
    try {
        return await chatSocket.request<GetRoomChatMessResponse>(
            "GET_ROOM_CHAT_MES",
            params
        )
    } catch (e) {
        console.error("Socket testing failed:", e);
        throw e;
    }
}

export function sendMessageRoom(params: SendRoomChatRequest) {
    try {
        return chatSocket.send(
            "SEND_CHAT",
            params
        )
    } catch (e) {
        console.error("Socket testing failed:", e);
        throw e;
    }
}
