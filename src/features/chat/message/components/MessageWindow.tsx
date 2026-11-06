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

            <div className={"main-section"}>
                <div className={"time-separator"}>
                    <i className="fa-solid fa-calendar"></i>
                    Hôm nay, 24 tháng 10
                </div>

                <div className={"receiver-msg__block"}>
                    <div className={"receiver-msg__avatar"}>
                        <img className={"img-avatar"} src="/src/shared/assets/avatar.webp"/>
                    </div>
                    <ul className={"receiver-msg__list-content"}>
                        <li className={"receiver-msg__name"}>
                            <div className={"receiver-msg__name"}>
                               Minh Anh
                            </div>
                        </li>
                        <li>
                            <div className={"receiver-msg__content"}>
                                Đúng rồi nhóm 3 người tụi mình chia nhau: cậy làm chat workshop, bảo làm Auth, còn mình
                                phụ trách media
                            </div>
                        </li>
                        <li>
                            <div className={"receiver-msg__content"}>
                                Chiều này trao đổi phần gioa diện nha bạn ?
                            </div>
                            <div className={"msg-time"}>12:00</div>
                        </li>
                    </ul>
                </div>

                <div className={"sender-msg__block"}>
                    <ul className={"sender-msg__list-content"}>
                        <li>
                            <div className={"sender-msg__content"}>
                                Đúng rồi nhóm 3 người tụi mình chia nhau: cậy làm chat, bảo làm Auth, còn mình phụ trách media
                            </div>
                        </li>
                        <li>
                            <div className={"sender-msg__content"}>
                                Chiều này trao đổi phần gioa diện nha bạn ?
                            </div>
                            <div className={"msg-time"}>12:00</div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default MessageWindow
