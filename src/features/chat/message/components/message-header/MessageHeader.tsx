import './MessageHeader.scss'
import {useTranslation} from "react-i18next";

interface MessageHeaderProps {
    receiverName: string;
    onToggleInfo: () => void;
    onCall: () => void;
    isCallDisabled: boolean;
}

export default function MessageHeader({
    receiverName,
    onToggleInfo,
    onCall,
    isCallDisabled,
}: MessageHeaderProps) {
    const {t} = useTranslation("message");

    return (
        <div className={"message-header"}>
            <div className={"avatar-section"}>
                <img className={"img-avatar"} src="/src/shared/assets/avatar.webp"/>
                <div className={"username"}>
                    <h5>{receiverName}</h5>
                    <div className={"state-activity"}>
                        <div className={"dot-state"}></div>
                        <div className={"name-state"}>{t("message.status.active")}</div>
                    </div>
                </div>
            </div>

            <div className={"action-icon"}>
                <ul>
                    <li>
                        <button
                            type="button"
                            className="call-icon__box"
                            onClick={onCall}
                            disabled={isCallDisabled}
                            aria-label="Bắt đầu cuộc gọi"
                            title={isCallDisabled ? "Chọn cuộc trò chuyện cá nhân để gọi" : "Gọi điện"}
                        >
                            <i className="fa-solid fa-phone"></i>
                        </button>
                    </li>

                    <li>
                        <div className={""}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                    </li>

                    <div className={"separator"}></div>

                    <li>
                        <div className={"info-icon__box"} onClick={onToggleInfo}>
                            <i className="fa-solid fa-info"></i>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}