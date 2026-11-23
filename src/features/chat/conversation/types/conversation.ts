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

export interface RoomMember {
    id: number;
    name: string;
}

export interface CreateRoomRequest {
    name: string;
}

export interface CreateRoomResponse {
    name: string;
    user?: RoomMember[];
    userList?: RoomMember[];
}

export interface CheckUserExistRequest {
    user: string;
}

export interface CheckUserExistResponse {
    status: boolean;
}

export type RoomModalTab = "direct" | "group";
export type RoomModalMode = "direct" | "create" | "join";
export type JoinRoomRequest = CreateRoomRequest;
export type JoinRoomResponse = CreateRoomResponse;