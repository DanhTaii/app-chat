import './message-window.scss'

// Dữ liệu mẫu chỉ để dựng khung, sẽ thay bằng dữ liệu từ API
const SAMPLE_MESSAGES = [
  { id: 1, mine: false, text: 'Chiều nay mình trao đổi phần giao diện nhé?', time: '10:30' },
  { id: 2, mine: true, text: 'Ok, mình đọc thiết kế rồi.', time: '10:35' },
  { id: 3, mine: false, text: 'Nhóm mình chia việc như sau nhé.', time: '10:42' },
]

// Wireframe khung tin nhắn: tiêu đề + luồng tin nhắn + ô soạn tin
function MessageWindow() {
  return (
    <section className="message-window" aria-label="Cuộc trò chuyện">
      <header className="message-window__header">
        <span className="message-window__avatar" aria-hidden="true">M</span>
        <h2>Minh Anh</h2>
      </header>

      <div className="message-window__thread" role="log" aria-live="polite">
        {SAMPLE_MESSAGES.map((m) => (
          <div
            key={m.id}
            className={m.mine ? 'message-window__bubble message-window__bubble--mine' : 'message-window__bubble'}
          >
            <p>{m.text}</p>
            <time>{m.time}</time>
          </div>
        ))}
      </div>

      <form className="message-window__composer" onSubmit={(e) => e.preventDefault()}>
        <textarea
          name="message"
          rows={1}
          aria-label="Nhập tin nhắn"
          placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter xuống dòng)"
        />
        <button type="submit">Gửi</button>
      </form>
    </section>
  )
}

export default MessageWindow
