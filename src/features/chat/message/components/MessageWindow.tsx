import './MessageWindow.scss'
import MessageComposer from "@/features/chat/message/components/message-composer/MessageComposer.tsx";
import MessageList from "@/features/chat/message/components/message-list/MessageList.tsx";
import MessageHeader from "@/features/chat/message/components/message-header/MessageHeader.tsx";
import {findGroupListMessage, findListMessage} from "@/features/chat/message/services/messageApi.ts";
import {useAppDispatch, useAppSelector} from "@/app/store/hooks.ts";
import {useEffect} from "react";
import {
    addPeopleMessages,
    addRoomMessages,
    loadPeopleMessages,
    loadRoomMessages
} from "@/features/chat/message/slices/messageSlice.ts";
import chatSocket from "@/shared/services/socket/socketService.ts";

// @ts-ignore
function MessageWindow({receiverName, conversationType, onToggleInfo}) {
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
        if (conversationType === 0) {
            getListMessage(receiverName, page)
        } else if (conversationType === 1) {
            getRoomListMessage(receiverName, page)
        }

        // console.log("MSG WINDOW - CONVERSATION: ",conversations)


        function handleIncomingMessage(serverResponse: any) {
            // BƯỚC 1: KIỂM TRA RESPONSE
            console.log("========== NHẬN TIN NHẮN TỪ SERVER ==========");
            console.log("SERVER RESPONSE:", serverResponse);

            if (
                serverResponse.status !== "success" ||
                !serverResponse.data
            ) {
                console.log("RESPONSE KHÔNG HỢP LỆ HOẶC BỊ ERROR");
                return;
            }

            // BƯỚC 2: KIỂM TRA DỮ LIỆU
            console.log("========== CHECK PEOPLE MESSAGE ==========");

            console.log({
                conversationType: conversationType,
                messageType: serverResponse.data.type,

                receiverName: receiverName,
                currentUsername: user?.username,

                sender: serverResponse.data.name,
                to: serverResponse.data.to,

                check1: conversationType === 0,
                check2: serverResponse.data.type === 0,
                check3: serverResponse.data.to === user?.username,
                check4: serverResponse.data.name === receiverName
            });

            if (serverResponse.status === "success" && serverResponse.data) {
                console.log("1. CHUẨN BỊ DISPATCH:", {
                    name: receiverName,
                    message: serverResponse.data
                });

                if (conversationType === 0 &&
                    conversationType === serverResponse.data.type &&
                    receiverName === serverResponse.data.to
                ) {
                    dispatch(addPeopleMessages({
                        name: serverResponse.data.to,
                        message: {
                            name: serverResponse.data.name,
                            to: serverResponse.data.to,
                            mes: serverResponse.data.mes,
                            createAt: new Date().toISOString(),
                            type: serverResponse.data.type,
                        }
                    }))
                    console.log("2. ĐÃ GỌI DISPATCH PEOPLE MESSAGE");
                } else if (
                    conversationType === 1 &&
                    conversationType === serverResponse.data.type &&
                    receiverName === serverResponse.data.to
                ) {
                    dispatch(addRoomMessages({
                        name: serverResponse.data.to,
                        message: {
                            name: serverResponse.data.name,
                            to: serverResponse.data.to,
                            mes: serverResponse.data.mes,
                            createAt: new Date().toISOString(),
                            type: serverResponse.data.type,
                        }
                    }));
                    console.log("2. ĐÃ GỌI DISPATCH ROOM MESSAGE");
                } else {
                    console.log("KHÔNG THỎA ĐIỀU KIỆN NÀO HẾT")
                }
            }
        }

        chatSocket.subscribeReceiveMessage("SEND_CHAT", handleIncomingMessage)

        return () => {
            chatSocket.unsubscribeReceiveMessage("SEND_CHAT", handleIncomingMessage)
        }


    }, [dispatch, receiverName, conversationType]);

    return (
        <section className="message-window">
            <MessageHeader receiverName={receiverName} onToggleInfo={onToggleInfo}/>

            <MessageList conversations={conversations} user={user}/>

            <MessageComposer receiverName={receiverName} user={user} conversationType={conversationType}/>
        </section>
    )
}

export default MessageWindow
