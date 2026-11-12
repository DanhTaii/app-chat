
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
        userList: {
            id: number;
            name: string;
        }[];
        chatData: Message[];
    };
    mes?: string;
}

// ======================================= SỬ DUỤNG CHO REDUX STORE
// 1 là room chat |
// 0 là people chat
export interface PeopleConversation {
    type: 0;
    messages: Message[];
}

export interface RoomConversation {
    type: 1;
    name: string;
    user: {
        id: number;
        name: string;
    }[];
    messages: Message[];
}