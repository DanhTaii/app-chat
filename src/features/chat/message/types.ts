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