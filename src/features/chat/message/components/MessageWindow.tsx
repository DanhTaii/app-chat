import './MessageWindow.scss'
import MessageComposer from "@/features/chat/message/components/message-composer/MessageComposer.tsx";
import MessageList from "@/features/chat/message/components/message-list/MessageList.tsx";
import MessageHeader from "@/features/chat/message/components/message-header/MessageHeader.tsx";
import {useAppSelector} from "@/app/store/hooks.ts";
import {useMessageRealtime} from "@/features/chat/message/hooks/useMessageRealtime.ts";
// import {useMessage} from "@/features/chat/message/hooks/useMessage.ts";

interface MessageWindowProps {
    receiverName: string;
    conversationType: number | null;
    onToggleInfo: () => void;
    onCall: () => void;
    isCallDisabled: boolean;
}

function MessageWindow({
    receiverName,
    conversationType,
    onToggleInfo,
    onCall,
    isCallDisabled,
}: MessageWindowProps) {
    // let page = 1;

    const user = useAppSelector((state) => state.auth.user)

    // // 2 hàm xử lý hook
    // const { conversations } = useMessage(receiverName, page, conversationType);

    useMessageRealtime(receiverName, conversationType,);

    return (
        <section className="message-window">
            <MessageHeader
                receiverName={receiverName}
                onToggleInfo={onToggleInfo}
                onCall={onCall}
                isCallDisabled={isCallDisabled}
            />

            {conversationType !== null && (
                <>
                    <MessageList receiverName={receiverName} user={user} conversationType={conversationType}/>
                    <MessageComposer receiverName={receiverName} user={user} conversationType={conversationType}/>
                </>
            )}
        </section>
    )
}

export default MessageWindow
