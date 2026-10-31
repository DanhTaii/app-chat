import './conversation-list.scss'

const SAMPLE_CONVERSATIONS = [
  { id: 1, name: 'Minh Anh', lastMessage: 'Chiều nay mình trao đổi phần giao diện nhé?', time: '10:42' },
  { id: 2, name: 'Quốc Bảo', lastMessage: 'Tớ vừa xem qua API đồ án rồi.', time: '09:15' },
  { id: 3, name: 'Nhóm Frontend', lastMessage: 'Hẹn gặp ở thư viện 2h nhé!', time: 'Hôm qua' },
]

// Wireframe danh sách hội thoại: khung tìm kiếm + danh sách tĩnh
function ConversationList() {
  return (
    <aside className="conversation-list" aria-label="Danh sách hội thoại">
      <h2>Tin nhắn</h2>
      <input
        type="search"
        className="conversation-list__search"
        aria-label="Tìm cuộc trò chuyện"
        placeholder="Tìm cuộc trò chuyện..."
      />
      <div className="conversation-list__filters" role="group" aria-label="Lọc hội thoại">
          <button type="button" className="conversation-list__chip conversation-list__chip-active" aria-pressed="true">Tất cả
              <span className="conversation-list__dot" aria-hidden="true"></span>
          </button>
          <button type="button" className="conversation-list__chip" aria-pressed="false">Chưa đọc
              <span className="conversation-list__count">3</span>
          </button>
          <button type="button" className="conversation-list__chip" aria-pressed="false">Nhóm
          </button>
      </div>
      <ul>
        {SAMPLE_CONVERSATIONS.map((c, index) => (
          <li key={c.id}>
            <button
              type="button"
              className="conversation-list__item"
              aria-current={index === 0 ? 'true' : undefined}
            >
              <span className="conversation-list__avatar" aria-hidden="true">
                {c.name.charAt(0)}
              </span>
              <span className="conversation-list__text">
                <span className="conversation-list__name">{c.name}</span>
                <span className="conversation-list__last">{c.lastMessage}</span>
              </span>
              <span className="conversation-list__time">{c.time}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default ConversationList
