import './MessageWindow.scss'
import MessageComposer from "@/features/chat/message/components/message-composer/MessageComposer.tsx";
import MessageList from "@/features/chat/message/components/message-list/MessageList.tsx";
import MessageHeader from "@/features/chat/message/components/message-header/MessageHeader.tsx";
import {useAppSelector} from "@/app/store/hooks.ts";
import {useMessageRealtime} from "@/features/chat/message/hooks/useMessageRealtime.ts";
import {useMessage} from "@/features/chat/message/hooks/useMessage.ts";

// @ts-ignore
function MessageWindow({receiverName, conversationType, onToggleInfo}) {
    let page = 1;

    const user = useAppSelector((state) => state.auth.user)

    // 2 hàm xử lý hook
    const { messages } = useMessage(receiverName, page, conversationType);

    useMessageRealtime(receiverName, conversationType,);

    return (
        <section className="message-window">
            <MessageHeader receiverName={receiverName} onToggleInfo={onToggleInfo}/>

            <MessageList conversations={messages} user={user}/>

            <MessageComposer receiverName={receiverName} user={user} conversationType={conversationType}/>
        </section>
    )
}

export default MessageWindow
