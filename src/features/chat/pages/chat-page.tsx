import ConversationList from '../conversation/components/conversation-list'
import MessageWindow from '../message/components/MessageWindow.tsx'
import './chat-page.scss'
import InfoPanel from "@/features/chat/info-panel/components/InfoPanel.tsx";
import {useState} from "react";

// chỉ ghép Conversation và Message
function ChatPage() {
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const handleToggleInfo = () => {
        // prev là giá trị state trước khi cập nhật.
        setIsInfoOpen(prev => !prev)
    }

    return (
        <div className={`chat-page ${isInfoOpen ? 'info-open' : ''}`}>
            <ConversationList/>
            <MessageWindow onToggleInfo={handleToggleInfo}/>

            {/* Cú pháp Conditional Rendering nếu isInforOpen là true thì sẽ render InfoPanel*/}
            {isInfoOpen && <InfoPanel/>}
        </div>
    )
}

export default ChatPage
