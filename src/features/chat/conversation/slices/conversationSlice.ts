import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {ApiConversationItem} from "@/features/chat/conversation/types/conversation.ts";

export interface SelectedConversation {
    name: string;
    type: 0|1;
}

interface ConversationState {
    conversations: ApiConversationItem[];
    selectedConversation: SelectedConversation | null;
}

const initialState: ConversationState = {
    conversations: [],
    selectedConversation: null,
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
        }
    }
});

export const { setConversations, selectConversation } = conversationSlice.actions;
export default conversationSlice.reducer;