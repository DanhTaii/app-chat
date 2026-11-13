import type {RootState} from "@/app/store/store.ts";

export const selectMessagesByConversationName = (
    state: RootState,
    conversationName: string
) => {
    return state.message.conversations[conversationName] ?? [];
};