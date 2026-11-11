import {createSlice} from "@reduxjs/toolkit";
import type {Message} from "@/features/chat/message/types.ts";

// DỊNH DẠNG KIỂU MESSAGE STATE SẼ NHẬN LÀ DANH SÁCH CÁC DẠNG MESSGAE
type MessageState = {
    list: Message[];
};

// TẠO 1 MESSAGE STATE RỖNG
const initialState: MessageState = {
    list: []
};

const messageSlice = createSlice({
    initialState: initialState,
    name: "message",
    reducers: {
        loadMessages: (state, action) => {
            state.list = action.payload;
        }
    }
});

export const {loadMessages} = messageSlice.actions;

export default messageSlice.reducer