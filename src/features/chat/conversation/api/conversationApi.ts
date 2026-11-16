import chatSocket from "@/shared/services/socket/socketService.ts";
import type {ApiConversationItem, CheckUserOnlineRequest, CheckUserOnlineResponse,CreateRoomRequest, CreateRoomResponse} from "@/features/chat/conversation/types/conversation.ts";

let onlineCheckQueue: Promise<unknown> = Promise.resolve();

export const getUserList = async (): Promise<ApiConversationItem[]> => {
    await chatSocket.connect();
    const response = await chatSocket.request<ApiConversationItem[]>("GET_USER_LIST",{});
    return  response.data ?? [];
}

export const checkUserOnline = async (user: string): Promise<boolean> => {
    const task = onlineCheckQueue.then(async () => {
        await chatSocket.connect();
        const payload: CheckUserOnlineRequest = { user };
        const response = await chatSocket.request<CheckUserOnlineResponse>(
            "CHECK_USER_ONLINE",
            payload
        );
        return Boolean(response.data?.status);
    });
    onlineCheckQueue = task.catch(() => false);
    return task;
};

export const createRoom = async (name: string): Promise<CreateRoomResponse> => {
    await chatSocket.connect();
    const payload: CreateRoomRequest = { name };
    const response = await chatSocket.request<CreateRoomResponse>(
        "CREATE_ROOM",
        payload
    );
    return response.data ?? { name };
};