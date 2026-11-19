import './InfoPanel.scss'
import Button from "@/shared/components/Button.tsx";
import {useTranslation} from "react-i18next";
import type {UploadedMedia} from "@/features/chat/message/types.ts";

export default function InfoPanel({mediaMessages}: {mediaMessages: UploadedMedia[]}) {
    const {t} = useTranslation("infoPanel");

    return (
        <aside className="info-panel">
            <div className={"title-container"}>
                <h3>{t("info-panel.title.conversation-info")}</h3>
            </div>

            <hr/>

            <div className={"user-info"}>
                <img className={"img-avatar"} src="/src/shared/assets/avatar.webp"/>
                <div className={"username__container"}>
                    <div>
                        Minh Anh
                    </div>
                    <i className="fa-solid fa-pen"></i>
                </div>
    
            </div>

            <hr/>

            <div className={"resource__image"}>
                {mediaMessages.length > 0 ? (
                    <div className="resource__media-list">
                        {mediaMessages.map(media => (
                            <div className="resource__media-item" key={media.url} title={media.name}>
                                {media.kind === "image" ? (
                                    <a href={media.url} target="_blank" rel="noreferrer" aria-label={`Mở ảnh ${media.name}`}>
                                        <img src={media.url} alt={media.name} loading="lazy" />
                                    </a>
                                ) : (
                                    <video src={media.url} controls preload="metadata" aria-label={media.name} />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="resource__media-empty">Không có ảnh hay video nào ở cuộc trò chuyện này</p>
                )}
                <Button variant = "primary" className="btn">
                    {t("info-panel.button.watch-all")}
                </Button>
              
            </div>

            <hr/>

            <div className={"resource__image"}>
                <div className={"title"}>
                    {t("info-panel.title.file")}
                </div>

            </div>

        </aside>
    )
}
