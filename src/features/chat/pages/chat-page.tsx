import ConversationList from '../conversation/components/conversation-list'
import MessageWindow from '../message/components/MessageWindow.tsx'
import './chat-page.scss'
import InfoPanel from "@/features/chat/info-panel/components/InfoPanel.tsx";
import {useState} from "react";
import {useAppSelector} from "@/app/store/hooks.ts";

// chỉ ghép Conversation và Message
function ChatPage() {
    const [isInfoOpen, setIsInfoOpen] = useState(true);

    // 1 là room chat |
    // 0 là people chat
    //
    // const receiverName = "Wabisoo_";
    // const typeConversation = 0;

    // const receiverName = "Lớp Karate thầy Quang"
    // const typeConversation = 1;
    const selectedConversation = useAppSelector((state) => state.conversation.selectedConversation);
    const receiverName = selectedConversation?.name ?? "";
    const typeConversation = selectedConversation?.type ?? null;


    const handleToggleInfo = () => {
        // prev là giá trị state trước khi cập nhật.
        setIsInfoOpen(prev => !prev)
    }

    return (
        <div className={`chat-page ${isInfoOpen ? 'info-open' : ''}`}>
            <ConversationList/>
            <MessageWindow onToggleInfo={handleToggleInfo} receiverName={receiverName}
                           conversationType={typeConversation}/>

            {/* Cú pháp Conditional Rendering nếu isInforOpen là true thì sẽ render InfoPanel*/}
            {isInfoOpen && <InfoPanel/>}
        </div>
    )
}

export default ChatPage
