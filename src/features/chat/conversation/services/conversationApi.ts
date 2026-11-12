import chatSocket from "@/shared/services/socket/socketService.ts";
import type {ApiConversationItem} from "@/features/chat/conversation/types/conversation.ts";

export const getUserList = async (): Promise<ApiConversationItem[]> => {
    await chatSocket.connect();
    const response = await chatSocket.request<ApiConversationItem[]>("GET_USER_LIST",{});
    return  response.data ?? [];
}