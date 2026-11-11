import chatSocket, {type SocketResponse} from "@/shared/services/socket/socketService.ts";
import type {GetPeopleChatMessRequest, GetPeopleChatMessResponse} from "@/features/chat/message/types.ts";

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