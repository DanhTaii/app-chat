export interface ApiConversationItem{
    name: string;
    type: 0|1;
    actionTime: string;
}

export interface CheckUserOnlineRequest {
    user: string;
}
export interface CheckUserOnlineResponse {
    status: boolean;
}