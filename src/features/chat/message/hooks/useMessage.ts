import {findGroupListMessage, findListMessage} from "@/features/chat/message/api/messageApi.ts";
import {loadPeopleMessages, loadRoomMessages} from "@/features/chat/message/store/messageSlice.ts";
import {useAppDispatch, useAppSelector} from "@/app/store/hooks.ts";
import {selectMessagesByConversationName} from "@/features/chat/message/store/messageSelector.ts";
import {useEffect} from "react";


// Nhận tên người nhận và loại conversation.
// Gọi API tương ứng.
// Dispatch dữ liệu vào Redux.
// Lấy dữ liệu từ Redux.
// Trả dữ liệu cho Component sử dụng.

export function useMessage(receiver: string, page: number, conversationType: number) {
    const dispatch = useAppDispatch();

    const messages = useAppSelector(state =>
        selectMessagesByConversationName(state, receiver)
    );

    useEffect(() => {
        async function getListMessage() {
            // DỰA VÀO LOẠI MÀ BÊN CONVERSATION CUNG CẤP MÀ LOAD DANH SÁCH TIN NHẮN LÊN
            if (conversationType === 0) {
                const response = await findListMessage({
                    name: receiver,
                    page: page
                });
                // LƯU VAO REDUX
                // KHÚC NÀY CHỈ LÀ response.data thôi vì bên API thầy cấp hiện đang trả về đúng là 1 danh sách tin nhắn
                dispatch(loadPeopleMessages({
                    name: receiver,
                    messages: response.data ?? []
                }));
            } else if (conversationType === 1) {
                // CALL API
                const response = await findGroupListMessage({
                    name: receiver,
                    page: page,
                }) as any

                // LƯU KẾT QUAR VÀO REDUX
                // TRONG SHEET THÌ API NÀY ĐANG ĐẶT TÊN KHÁC:
                // chatMes và user chứ không phải userList và chatData
                if (response.status === "success" && response.data) {
                    dispatch(loadRoomMessages({
                        name: receiver,
                        user: response.data.userList ?? [],
                        messages: response.data.chatData ?? []
                    }));
                }
            } else {
                throw new Error("Invalid response data !")
            }
        }

        getListMessage();

    }, [dispatch, receiver, conversationType])

    return {messages};
}
