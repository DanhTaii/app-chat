import './MessageWindow.scss'
import MessageComposer from "@/features/chat/message/components/message-composer/MessageComposer.tsx";
import MessageList from "@/features/chat/message/components/message-list/MessageList.tsx";
import MessageHeader from "@/features/chat/message/components/message-header/MessageHeader.tsx";
import {findGroupListMessage, findListMessage} from "@/features/chat/message/services/messageApi.ts";
import {useAppDispatch, useAppSelector} from "@/app/store/hooks.ts";
import {useEffect} from "react";
import {loadPeopleMessages, loadRoomMessages} from "@/features/chat/message/slices/messageSlice.ts";

// @ts-ignore
function MessageWindow({onToggleInfo}) {
    const receiverName = "Wabisoo_";
    let typeConversation = 1;
    let page = 1;

    const user = useAppSelector((state) => state.auth.user)

    // ============== XỬ LÝ REDUX STORE + HOOK CALL API ==============
    const conversations = useAppSelector(
        (state) => state.message?.conversations[receiverName] ?? []
    )
    const listMsg = conversations?.messages ?? []
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
                name: receiverName,
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
            if (response.status === "success" && response.data) {
                dispatch(loadRoomMessages({
                    name: receiverName,
                    user: response.data.user ?? [],
                    messages: response.data.chatMes ?? []
                }));
            }
        }

        // DỰA VÀO LOẠI MÀ BÊN CONVERSATION CUNG CẤP MÀ LOAD DANH SÁCH TIN NHẮN LÊN
        if (typeConversation === 0) {
            const receiverName = "Wabisoo_";
            getListMessage(receiverName, page)
        } else if (typeConversation === 1) {
            const receiverName = "Lớp Karate thầy Quang";
            getRoomListMessage(receiverName, page)
        }

    }, [dispatch]);

    return (
        <section className="message-window">
            <MessageHeader receiverName={receiverName} onToggleInfo={onToggleInfo}/>

            <MessageList listMsg={listMsg} user={user}/>

            <MessageComposer receiverName={receiverName}/>
        </section>
    )
}

export default MessageWindow
