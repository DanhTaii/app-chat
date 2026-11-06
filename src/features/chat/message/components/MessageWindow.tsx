import './MessageWindow.scss'

function MessageWindow() {
    return (
        <section className="message-window">
            <div className={"header-section"}>
                <div className={"avatar-section"}>
                    <img className={"img-avatar"} src="/src/shared/assets/avatar.webp"/>
                    <div className={"username"}>
                        <h5>Minh Anh</h5>
                        <div className={"state-activity"}>
                            <div className={"dot-state"}></div>
                            <div className={"name-state"}>Đang hoạt động</div>
                        </div>
                    </div>
                </div>

                <div className={"action-icon"}>
                    <ul>
                        <li>
                            <div className={""}>
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </div>
                        </li>

                        <div className={"separator"}></div>

                        <li>
                            <div className={"info-icon__box"}>
                                <i className="fa-solid fa-info"></i>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default MessageWindow
