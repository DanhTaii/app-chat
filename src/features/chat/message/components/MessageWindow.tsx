import './MessageWindow.scss'
import Button from "../../../../shared/components/Button";
import Input from "../../../../shared/components/Input";

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
                                Đúng rồi nhóm 3 người tụi mình chia nhau: cậy làm chat, bảo làm Auth, còn mình phụ trách
                                media
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

            <div className={"footer"}>
                <div className={"footer-container"}>
                    <div className={"footer-toolbar"}>
                        <div className={"footer-toolbar__list-container"}>
                            <ul className={"footer-toolbar__list"}>
                                <li className={"footer-toolbar__item"}>
                                    <i className="fa-solid fa-paperclip"></i>
                                </li>
                                <li className={"footer-toolbar__item"}>
                                    <i className="fa-regular fa-face-laugh"></i>
                                </li>
                                <li className={"footer-toolbar__item"}>
                                    <i className="fa-regular fa-image"></i>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <i className="fa-solid fa-ellipsis"></i>
                        </div>

                    </div>
                    <div className={"footer-composer"}>
                        <form className={"footer-composer__container"}>
                            <Input
                                placeholder="Nhập tin nhắn..."
                                aria-label="Nhập tin nhắn"
                                className="message-input"
                            />

                            <Button type="button" className="btn">
                                Gửi
                                <i className="fa-solid fa-paper-plane"></i>
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MessageWindow
