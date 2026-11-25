import './InfoPanel.scss'
import Button from "@/shared/components/Button.tsx";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import type {UploadedMedia} from "@/features/chat/message/types.ts";
import MediaTile from "./MediaTile.tsx";

export default function InfoPanel({mediaMessages}: {mediaMessages: UploadedMedia[]}) {
    const {t} = useTranslation("infoPanel");
    const [showAllMedia, setShowAllMedia] = useState(false);
    const latestMediaMessages = mediaMessages.slice(0, 6);

    return (
        <aside className={`info-panel${showAllMedia ? " info-panel--media" : ""}`}>
            {showAllMedia ? (
                <>
                    <header className="info-panel__media-header">
                        <button type="button" className="info-panel__back" onClick={() => setShowAllMedia(false)}>
                            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                            {t("info-panel.button.back")}
                        </button>
                        <h3>{t("info-panel.title.image-video")}</h3>
                    </header>
                    <div className="media-gallery__grid">
                        {mediaMessages.map(media => <MediaTile key={media.url} media={media} />)}
                    </div>
                </>
            ) : (
                <>
                    <div className="title-container">
                        <h3>{t("info-panel.title.conversation-info")}</h3>
                    </div>

                    <hr />

                    <div className="user-info">
                        <img className="img-avatar" src="/src/shared/assets/avatar.webp" />
                        <div className="username__container">
                            <div>Minh Anh</div>
                            <i className="fa-solid fa-pen" />
                        </div>
                    </div>

                    <hr />

                    <div className="resource__image">
                        {latestMediaMessages.length > 0 ? (
                            <div className="resource__media-list">
                                {latestMediaMessages.map(media => <MediaTile key={media.url} media={media} />)}
                            </div>
                        ) : (
                            <p className="resource__media-empty">{t("info-panel.empty.image-video", {defaultValue: "Không có hình ảnh hay video trong cuộc trò chuyện này"})}</p>
                        )}
                        {mediaMessages.length > 0 && (
                            <Button
                                variant="primary"
                                className="btn"
                                onClick={() => setShowAllMedia(true)}
                            >
                                {t("info-panel.button.watch-all")}
                            </Button>
                        )}
                    </div>

                    <hr />

                    <div className="resource__image">
                        <div className="title">{t("info-panel.title.file")}</div>
                    </div>
                </>
            )}
        </aside>
    );
}
