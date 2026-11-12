import {createSlice} from "@reduxjs/toolkit";
import type {
    PeopleConversation, RoomConversation
} from "@/features/chat/message/types.ts";

// DỊNH DẠNG KIỂU MESSAGE STATE SẼ NHẬN LÀ DANH SÁCH CÁC DẠNG MESSGAE
type MessageState = {
    conversations: {
        [name: string]: PeopleConversation | RoomConversation
    };
};

// TẠO 1 MESSAGE STATE RỖNG
const initialState: MessageState = {
    conversations: {}
};

const messageSlice = createSlice({
    initialState: initialState,
    name: "message",
    reducers: {
        loadPeopleMessages: (state, action) => {
            const {name, messages} = action.payload;
            state.conversations[name] = {
                type: 0,
                messages
            }
        },

        loadRoomMessages: (state, action) => {
            const {name, user, messages} = action.payload
            state.conversations[name] = {
                type: 1,
                name,
                user,
                messages
            }
        }
    }
});

export const {loadPeopleMessages, loadRoomMessages} = messageSlice.actions;

export default messageSlice.reducer