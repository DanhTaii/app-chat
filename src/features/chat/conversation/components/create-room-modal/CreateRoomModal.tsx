import { useState, useEffect, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import Input from "@/shared/components/Input";
// @ts-ignore
import Button from "@/shared/components/button";
import "./CreateRoomModal.scss";

interface CreateRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateRoom: (roomName: string) => Promise<void>;
}

function CreateRoomModal({ isOpen, onClose, onCreateRoom }: CreateRoomModalProps) {
    const { t } = useTranslation("conversation");
    const [roomName, setRoomName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setRoomName("");
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (submitting) return;

        const trimmedName = roomName.trim();
        if (!trimmedName) {
            setError(t("conversation.createRoom.errorEmpty"));
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await onCreateRoom(trimmedName);
            onClose();
        } catch (err) {
            const rawMessage = err instanceof Error ? err.message : "";
            if (rawMessage.toLowerCase().includes("exist")) {
                setError(t("conversation.createRoom.errorExist"));
            } else {
                setError(rawMessage || t("conversation.createRoom.errorDefault"));
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="create-room-modal__backdrop" role="presentation" onClick={() => {if (!submitting) onClose();}}>
            <div className="create-room-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="create-room-title"
                onClick={(event) => event.stopPropagation()}>
                <div className="create-room-modal__header">
                    <h3 id="create-room-title">{t("conversation.createRoom.title")}</h3>
                    <button type="button" className="create-room-modal__close" onClick={onClose} disabled={submitting} aria-label={t("conversation.createRoom.cancel")}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <form className="create-room-modal__form" onSubmit={handleSubmit}>
                    <div className="create-room-modal__field">
                        <label htmlFor="create-room-name-input">
                            {t("conversation.createRoom.label")}
                        </label>
                        <Input id="create-room-name-input" type="text" value={roomName}
                            onChange={(event) => {
                                setRoomName(event.target.value);
                                if (error) setError(null);
                            }}
                            placeholder={t("conversation.createRoom.placeholder")}
                            aria-invalid={Boolean(error)} disabled={submitting} autoFocus/>
                    </div>

                    {error && (
                        <p className="create-room-modal__error" role="alert">{error}</p>
                    )}

                    <div className="create-room-modal__actions">
                        <Button type="button" variant="secondary" className="btn" onClick={onClose} disabled={submitting}>
                            {t("conversation.createRoom.cancel")}
                        </Button>
                        <Button type="submit" variant="primary" className="btn" disabled={submitting}>
                            {submitting
                                ? t("conversation.createRoom.submitting")
                                : t("conversation.createRoom.submit")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateRoomModal;