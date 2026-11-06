import ConversationList from '../conversation/components/conversation-list'
import MessageWindow from '../message/components/MessageWindow.tsx'
import './chat-page.scss'

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
