import './MessageWindow.scss'
import MessageComposer from "@/features/chat/message/components/message-composer/MessageComposer.tsx";
import MessageList from "@/features/chat/message/components/message-list/MessageList.tsx";
import MessageHeader from "@/features/chat/message/components/message-header/MessageHeader.tsx";
import {findGroupListMessage, findListMessage} from "@/features/chat/message/services/messageApi.ts";
import {useAppDispatch, useAppSelector} from "@/app/store/hooks.ts";
import {useEffect} from "react";
import {loadPeopleMessages, loadRoomMessages} from "@/features/chat/message/slices/messageSlice.ts";

// @ts-ignore
function MessageWindow({receiverName, typeConversation, onToggleInfo}) {
    let page = 1;

    const user = useAppSelector((state) => state.auth.user)

    // ============== XỬ LÝ REDUX STORE + HOOK CALL API ==============
    const conversations = useAppSelector(
        (state) => state.message?.conversations[receiverName] ?? []
    )
    const dispatch = useAppDispatch();
    useEffect(() => {
        async function getListMessage(receiver: string, page: number) {
            // CALL APU
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
        }

        async function getRoomListMessage(receiver: string, page: number) {
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
        }

        // DỰA VÀO LOẠI MÀ BÊN CONVERSATION CUNG CẤP MÀ LOAD DANH SÁCH TIN NHẮN LÊN
        if (typeConversation === 0) {
            getListMessage(receiverName, page)
        } else if (typeConversation === 1) {
            getRoomListMessage(receiverName, page)
        }

    }, [dispatch]);

    return (
        <section className="message-window">
            <MessageHeader receiverName={receiverName} onToggleInfo={onToggleInfo}/>

            <MessageList conversations={conversations} user={user}/>

            <MessageComposer receiverName={receiverName}/>
        </section>
    )
}

export default MessageWindow
