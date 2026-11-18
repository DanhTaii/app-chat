import chatSocket from "@/shared/services/socket/socketService.ts";
import type {
    ApiConversationItem, CheckUserOnlineRequest, CheckUserOnlineResponse, CreateRoomRequest, CreateRoomResponse,
    JoinRoomRequest, JoinRoomResponse
} from "@/features/chat/conversation/types/conversation.ts";

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

async function sendRoomAction(
    event: "CREATE_ROOM" | "JOIN_ROOM",
    name: string
): Promise<CreateRoomResponse> {
    await chatSocket.connect();
    const payload: CreateRoomRequest | JoinRoomRequest = { name };
    const response = await chatSocket.request<CreateRoomResponse>(event, payload);
    return response.data ?? { name };
}

export const createRoom = (name: string): Promise<CreateRoomResponse> => {
    return sendRoomAction("CREATE_ROOM", name);
};

export const joinRoom = (name: string): Promise<JoinRoomResponse> => {
    return sendRoomAction("JOIN_ROOM", name);
};