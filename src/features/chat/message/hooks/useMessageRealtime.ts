import {useAppDispatch} from "@/app/store/hooks.ts";
import {useEffect} from "react";
import chatSocket from "@/shared/services/socket/socketService.ts";
import {addPeopleMessages, addRoomMessages} from "@/features/chat/message/store/messageSlice.ts";

export function useMessageRealtime(receiverName: string, conversationType: number) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // ---------------------- XỬ LÝ TIN NHẮN ĐẾN
        function handleIncomingMessage(serverResponse: any) {
            // BƯỚC 1: KIỂM TRA RESPONSE
            console.log("========== NHẬN TIN NHẮN TỪ SERVER ==========");
            console.log("SERVER RESPONSE:", serverResponse);

            if (serverResponse.status === "success" && serverResponse.data) {
                // console.log("1. CHUẨN BỊ DISPATCH:", {
                //     name: receiverName,
                //     message: serverResponse.data
                // });

                if (conversationType === 0 &&
                    conversationType === serverResponse.data.type &&
                    // vì do là người A gửi và người B nhận
                    // => tin nhắn A gửi B đang được xử lý trên màn hình của B
                    // cái receiverName ở đây là người B mà người A sẽ gửi
                    // Nhưng nếu ở góc nhìn của người B nhận được đoạn tin nhắn
                    // Thì tên người B sẽ là data.name chứ không thể là data.to
                    receiverName === serverResponse.data.name
                ) {
                    dispatch(addPeopleMessages({
                        name: serverResponse.data.name,
                        message: {
                            name: serverResponse.data.name,
                            to: serverResponse.data.to,
                            mes: serverResponse.data.mes,
                            createAt: new Date().toISOString(),
                            type: serverResponse.data.type,
                        }
                    }))
                    // console.log("2. ĐÃ GỌI DISPATCH PEOPLE MESSAGE");
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
                    // console.log("2. ĐÃ GỌI DISPATCH ROOM MESSAGE");
                } else {
                    throw new Error("Invalid response data !")
                }
            }
        }

        chatSocket.subscribeReceiveMessage("SEND_CHAT", handleIncomingMessage)

        return () => {
            chatSocket.unsubscribeReceiveMessage("SEND_CHAT", handleIncomingMessage)
        }
    }, [dispatch, receiverName, conversationType]);
}