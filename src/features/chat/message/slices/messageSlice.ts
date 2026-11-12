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

        addPeopleMessages: (state, action) => {
            const {name, message} = action.payload;

            // NẾU NHƯ CHƯA CÓ CONVERSATION THÌ TẠO MỚI 1 CÁI
            if (!state.conversations[name]) {
                state.conversations[name] = {
                    type: 0,
                    messages: []
                };
            }

            // RỒI THÊM MSG ĐÓ VÀO CONVERSATION
            // PHẢI LÀ unshift chứ không thể là push do nếu push là nó push lên trên đầu
            // NHƯNG BÊN MessageList đang hiển thị ngược lại. DO ĐÓ PHẢI CHO NÓ VÀO CUỐI
            state.conversations[name].messages.unshift(message);
        },

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
        },

        addRoomMessages: (state, action) => {
            const {name, message} = action.payload;
            state.conversations[name].messages.push(message)

        },
    }
});

export const {loadPeopleMessages, loadRoomMessages, addRoomMessages, addPeopleMessages} = messageSlice.actions;

export default messageSlice.reducer