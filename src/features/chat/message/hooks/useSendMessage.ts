import {
    addPeopleMessages,
    addRoomMessages
} from "@/features/chat/message/store/messageSlice.ts";
import {useAppDispatch} from "@/app/store/hooks.ts";
import {sendMessageRoom, sendMessageSingle} from "@/features/chat/message/api/messageApi.ts";

export function useSendMessage(receiverName: string, senderName: string, conversationType: number) {
    const dispatch = useAppDispatch();

    const sendMessage = (message: string) => {
        const content = message.trim();

        if (!content) return;

        try {
            if (conversationType === 0) {
                sendMessageSingle({
                    type: "people",
                    to: receiverName,
                    mes: content
                });
            } else if (conversationType === 1) {
                sendMessageRoom({
                    type: "room",
                    to: receiverName,
                    mes: content
                })
            } else {
                throw new Error("Invalid conversation type !");
                return false;
            }

            if (conversationType === 0) {
                dispatch(addPeopleMessages({
                    name: receiverName,
                    message: {
                        // id?: number;
                        name: senderName,
                        to: receiverName,
                        mes: content,
                        createAt: new Date().toISOString(),
                        type: conversationType,
                    }
                }));
            } else {
                dispatch(addRoomMessages({
                    name: receiverName,
                    message: {
                        // id?: number;
                        name: senderName,
                        to: receiverName,
                        mes: content,
                        createAt: new Date().toISOString(),
                        type: conversationType,
                    }
                }));
            }

            return true;
        } catch (e) {
            throw new Error(`Invalid conversation type !: ${e}}`);
            return false;
        }
    }

    return {sendMessage}

}