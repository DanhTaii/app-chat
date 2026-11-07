import './MessageList.scss'
import {useTranslation} from "react-i18next";

export default function MessageList() {
    const {t} = useTranslation("message");

    return (
        <div className={"message-list"}>
            <div className={"time-separator"}>
                <i className="fa-solid fa-calendar"></i>
                {t("message.separator.time.today")}, 24/10
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
    )
}