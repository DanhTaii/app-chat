import './MessageComposer.scss'
import Button from "../../../../../shared/components/Button";
import Input from "../../../../../shared/components/Input";
import {useTranslation} from "react-i18next";


export default function MessageComposer() {
    const {t} = useTranslation("message");

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
                        />

                        <Button type="button" className="btn">
                            {t("message.button.send")}
                            <i className="fa-solid fa-paper-plane"></i>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}