import '../../../styles/tokens.css'
import ConversationList from '../conversation/components/conversation-list'
import MessageWindow from '../message/components/message-window'
import './chat-page.css'

// chỉ ghép Conversation và Message
function ChatPage() {
  return (
    <div className="chat-page">
      <ConversationList />
      <MessageWindow />
    </div>
  )
}

export default ChatPage
