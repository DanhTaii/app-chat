import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {ApiConversationItem} from "@/features/chat/conversation/types/conversation.ts";

export interface SelectedConversation {
    name: string;
    type: 0|1;
}

interface ConversationState {
    conversations: ApiConversationItem[];
    selectedConversation: SelectedConversation | null;
    onlineUsers: Record<string, boolean>;
}

const initialState: ConversationState = {
    conversations: [],
    selectedConversation: null,
    onlineUsers: {}
};

function formatCurrentActionTime(): string {
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers:{
        setConversations: (state, action: PayloadAction<ApiConversationItem[]>) => {
            state.conversations = action.payload;
        },
        selectConversation: (state, action: PayloadAction<SelectedConversation>) => {
            state.selectedConversation = action.payload;
        },
        setUserOnlineStatus: (
            state,
            action: PayloadAction<{ name: string; online: boolean }>
        ) => {
            state.onlineUsers[action.payload.name] = action.payload.online;
        },
        addConversation: (
            state,
            action: PayloadAction<{ name: string; type: 0 | 1; actionTime?: string }>
        ) => {
            const exists = state.conversations.some(
                (item) =>
                    item.name === action.payload.name &&
                    item.type === action.payload.type
            );

            if (!exists) {
                state.conversations.unshift({
                    name: action.payload.name,
                    type: action.payload.type,
                    actionTime: action.payload.actionTime ?? formatCurrentActionTime(),
                });
            }

            state.selectedConversation = {
                name: action.payload.name,
                type: action.payload.type,
            };
        }
    }
});

export const { setConversations, selectConversation, setUserOnlineStatus, addConversation } = conversationSlice.actions;
export default conversationSlice.reducer;