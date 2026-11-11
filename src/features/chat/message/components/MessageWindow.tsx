import './MessageWindow.scss'
import MessageComposer from "@/features/chat/message/components/message-composer/MessageComposer.tsx";
import MessageList from "@/features/chat/message/components/message-list/MessageList.tsx";
import MessageHeader from "@/features/chat/message/components/message-header/MessageHeader.tsx";
import {findListMessage} from "@/features/chat/message/services/messageApi.ts";
import {useAppDispatch, useAppSelector} from "@/app/store/hooks.ts";
import {useEffect} from "react";
import {loadMessages} from "@/features/chat/message/slices/messageSlice.ts";

// @ts-ignore
function MessageWindow({onToggleInfo}) {
    const receiverName = "Wabisoo_";

    const user = useAppSelector((state) => state.auth.user)

    // ============== XỬ LÝ REDUX STORE + HOOK CALL API ==============
    const listMsg = useAppSelector((state) => state.message.list)
    const dispatch = useAppDispatch();
    useEffect(() => {
        async function getListMessage() {
            const response = await findListMessage({
                name: receiverName,
                page: 1
            });
            dispatch(loadMessages(response.data ?? []));
        }

        getListMessage();
    }, [dispatch]);

    return (
        <section className="message-window">
            <MessageHeader receiverName={receiverName} onToggleInfo={onToggleInfo}/>

            <MessageList listMsg={listMsg} user={user}/>

            <MessageComposer/>
        </section>
    )
}

export default MessageWindow
