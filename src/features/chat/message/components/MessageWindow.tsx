import './MessageWindow.scss'
import MessageComposer from "@/features/chat/message/components/message-composer/MessageComposer.tsx";
import MessageList from "@/features/chat/message/components/message-list/MessageList.tsx";
import MessageHeader from "@/features/chat/message/components/message-header/MessageHeader.tsx";

// @ts-ignore
function MessageWindow({onToggleInfo}) {
    return (
        <section className="message-window">
            <MessageHeader onToggleInfo={onToggleInfo}/>

            <MessageList/>

            <MessageComposer/>
        </section>
    )
}

export default MessageWindow
