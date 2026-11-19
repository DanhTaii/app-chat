import './MessageWindow.scss'
import MessageComposer from "@/features/chat/message/components/message-composer/MessageComposer.tsx";
import MessageList from "@/features/chat/message/components/message-list/MessageList.tsx";
import MessageHeader from "@/features/chat/message/components/message-header/MessageHeader.tsx";
import {useAppSelector} from "@/app/store/hooks.ts";
import {useMessageRealtime} from "@/features/chat/message/hooks/useMessageRealtime.ts";
import {useEffect, useState} from "react";
import type {UploadedMedia} from "@/features/chat/message/types.ts";
// import {useMessage} from "@/features/chat/message/hooks/useMessage.ts";

// @ts-ignore
function MessageWindow({receiverName, conversationType, onToggleInfo}) {
    // let page = 1;

    const user = useAppSelector((state) => state.auth.user)
    const [mediaMessages, setMediaMessages] = useState<UploadedMedia[]>([]);

    useEffect(() => {
        setMediaMessages([]);
    }, [receiverName, conversationType]);

    // // 2 hàm xử lý hook
    // const { conversations } = useMessage(receiverName, page, conversationType);

    useMessageRealtime(receiverName, conversationType,);

    return (
        <section className="message-window">
            <MessageHeader receiverName={receiverName} onToggleInfo={onToggleInfo}/>

            <MessageList receiverName={receiverName} user={user} conversationType={conversationType} mediaMessages={mediaMessages}/>

            <MessageComposer receiverName={receiverName} user={user} conversationType={conversationType} onMediaUploaded={(media) => setMediaMessages((current) => [...current, media])}/>
        </section>
    )
}

export default MessageWindow
