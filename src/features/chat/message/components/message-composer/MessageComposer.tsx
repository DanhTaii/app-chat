import './MessageComposer.scss'
// @ts-ignore
import Button from "../../../../../shared/components/Button";
import Input from "../../../../../shared/components/Input";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useSendMessage} from "@/features/chat/message/hooks/useSendMessage.ts";

// @ts-ignore
// 1 là room chat |
// 0 là people chat
export default function MessageComposer({receiverName, user, conversationType}) {
    const [mes, setMes] = useState("")
    const {t} = useTranslation("message");

    const {sendMessage} = useSendMessage(receiverName, user.username, conversationType);

    const handleSendMessage = async () => {
        const content = mes.trim();

        if (!content) return;

        const success = await sendMessage(content);
        if (success) {
            setMes("")
        }
    }

    return (
        <div className={"message-footer"}>
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
                            placeholder={t("message.placeholder.enter-message")}
                            aria-label="Nhập tin nhắn"
                            className="message-input"
                            value={mes}
                            onChange={event => setMes(event.target.value)}
                        />

                        <Button type="button" className="btn" onClick={handleSendMessage}>
                            {/*{t("message.button.send")}*/}
                            <i className="fa-solid fa-paper-plane"></i>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}