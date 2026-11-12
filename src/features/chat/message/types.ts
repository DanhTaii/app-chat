
// ======================================= ĐỊNH DẠNG GỬI VÀ NHẬN TỪ BÊN API BACKEND SERVER

export interface Message {
    id: number;
    name: string;
    to: string;
    mes: string;
    createAt: string;
    type: 0 | 1;
}

export interface GetPeopleChatMessRequest {
    name: string;
    page: number;
}

export interface GetPeopleChatMessResponse {
    status: "success" | "error";
    event: "GET_PEOPLE_CHAT_MES";
    data?: Message[];
    mes?: string;
}

export interface SendPeopleChatRequest {
    type: string,
    to: string,
    mes: string
}

export interface SendPeopleChatResponse {
    name: string,
    to: string,
    mes: string,
    type: 0 | 1
}

export interface GetRoomChatMessRequest {
    name: string,
    page: number
}

export interface GetRoomChatMessResponse {
    status: "success" | "error";
    event: "GET_ROOM_CHAT_MES";
    data: {
        name: string;
        user: {
            id: number;
            name: string;
        }[];
        chatMess: Message[];
    };
    mes?: string;
}

// ======================================= SỬ DUỤNG CHO REDUX STORE

export interface PeopleConversation {
    type: "people";
    messages: Message[];
}

export interface RoomConversation {
    type: "room";
    name: string;
    user: {
        id: number;
        name: string;
    }[];
    messages: Message[];
}