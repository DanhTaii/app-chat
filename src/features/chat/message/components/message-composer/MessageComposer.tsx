import './MessageComposer.scss'
// @ts-ignore
import Button from "../../../../../shared/components/Button";
import Input from "../../../../../shared/components/Input";
import {useTranslation} from "react-i18next";
import {useRef, useState} from "react";
import type {ChangeEvent} from "react";
import {useSendMessage} from "@/features/chat/message/hooks/useSendMessage.ts";
import {useUploadMedia} from "@/features/chat/message/hooks/useUploadMedia.ts";

// @ts-ignore
// 1 là room chat |
// 0 là people chat
type MessageComposerProps = {
    receiverName: string;
    user: {username: string} | null;
    conversationType: number;
};

export default function MessageComposer({receiverName,user,conversationType}: MessageComposerProps) {
    const [mes, setMes] = useState("")
    const [mediaSendError, setMediaSendError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {t} = useTranslation("message");
    const {uploadFile, isUploading, error: uploadError} = useUploadMedia();

    const {sendMessage} = useSendMessage(receiverName, user?.username ?? "", conversationType);

    const handleSendMessage = async () => {
        const content = mes.trim();

        if (!content) return;

        const success = await sendMessage(content);
        if (success) {
            setMes("")
        }
    }

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        setMediaSendError(null);
        const uploadedMedia = await uploadFile(file);
        if (!uploadedMedia) return;

        try {
            const sent = await sendMessage(uploadedMedia.url);
            if (!sent) setMediaSendError("Upload đc r mà chưa lưu url đc.");
        } catch {
            setMediaSendError("Upload đc trên Cloudinary nhưng ko lưu được URL vào chat app này.");
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
                                <button
                                    type="button"
                                    className="media-picker-button"
                                    aria-label="Chọn ảnh hoặc video"
                                    title="Chọn ảnh hoặc video"
                                    disabled={isUploading}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <i className="fa-regular fa-image"></i>
                                </button>
                                <input
                                    ref={fileInputRef}
                                    className="media-file-input"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,.jpg,.jpeg,.png,.webp,.mp4,.webm"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                            </li>
                        </ul>
                    </div>

                    <div>
                        <i className="fa-solid fa-ellipsis"></i>
                    </div>

                </div>
                {(isUploading || uploadError || mediaSendError) && (
                    <div className={uploadError || mediaSendError ? "media-upload-status media-upload-status--error" : "media-upload-status"} role={uploadError || mediaSendError ? "alert" : "status"}>
                        {isUploading ? "Đang tải ảnh hoặc video lên…" : uploadError || mediaSendError}
                    </div>
                )}
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
