import './InfoPanel.scss'
import Button from "@/shared/components/button.tsx";
import {useTranslation} from "react-i18next";
import {useState, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/app/store/hooks.ts";
import {outRoom} from "@/features/chat/conversation/api/conversationApi.ts";
import {removeConversation} from "@/features/chat/conversation/store/conversationSlice.ts";
import leaveRoomIcon from "@/shared/assets/leave-room.svg";
import type {UploadedMedia} from "@/features/chat/message/types.ts";
import MediaTile from "./MediaTile.tsx";

export default function InfoPanel({mediaMessages}: {mediaMessages: UploadedMedia[]}) {
    const {t} = useTranslation("infoPanel");
    const [showAllMedia, setShowAllMedia] = useState(false);
    const latestMediaMessages = mediaMessages.slice(0, 6);
    const dispatch = useAppDispatch();
    const selectedConversation = useAppSelector((state) => state.conversation.selectedConversation);
    const [leaving, setLeaving] = useState(false);
    const [leaveError, setLeaveError] = useState<string | null>(null);

    const isGroup = selectedConversation?.type === 1;
    const conversationName = selectedConversation?.name || "Minh Anh";

    useEffect(() => {
        setLeaveError(null);
        setLeaving(false);
    }, [selectedConversation?.name, selectedConversation?.type]);

    const handleLeaveRoom = async () => {
        if (!selectedConversation || leaving) return;
        try {
            setLeaving(true);
            setLeaveError(null);
            await outRoom(selectedConversation.name);
            dispatch(removeConversation({ name: selectedConversation.name, type: 1 }));
        } catch (err) {
            const rawMessage = err instanceof Error ? err.message.toLowerCase() : "";
            if (rawMessage.includes("owner")) {
                setLeaveError(t("info-panel.error.leave-owner"));
            } else {
                setLeaveError(t("info-panel.error.leave-default"));
            }
        } finally {
            setLeaving(false);
        }
    };

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
                            <div>{conversationName}</div>
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

                    {isGroup && (
                        <div className="info-panel__bottom">
                            {leaveError && (
                                <p className="info-panel__leave-error" role="alert">{leaveError}</p>
                            )}
                            <button type="button" className="info-panel__leave-btn" onClick={handleLeaveRoom} disabled={leaving}>
                                <img className="info-panel__leave-icon" src={leaveRoomIcon} alt="" aria-hidden="true" />
                                <span>{leaving ? t("info-panel.button.leaving-room") : t("info-panel.button.leave-room")}</span>
                            </button>
                        </div>
                    )}
                </>
            )}
        </aside>
    );
}
