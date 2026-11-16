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
        }
    }
});

export const { setConversations, selectConversation, setUserOnlineStatus } = conversationSlice.actions;
export default conversationSlice.reducer;