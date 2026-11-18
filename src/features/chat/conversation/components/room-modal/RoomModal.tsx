import { useState, useEffect, type FormEvent } from "react";
// import { useTranslation } from "react-i18next";
import Input from "@/shared/components/Input";
// @ts-ignore
import Button from "@/shared/components/button";
import "./RoomModal.scss";

interface RoomModalProps {
    isOpen: boolean;
    title: string;
    label: string;
    placeholder: string;
    cancelText: string;
    submitText: string;
    submittingText: string;
    emptyErrorText: string;
    onClose: () => void;
    onSubmit: (roomName: string) => Promise<void>;
    formatError?: (rawMessage: string) => string;
}

function RoomModal({isOpen, title, label, placeholder, cancelText, submitText, submittingText, emptyErrorText,
                       onClose, onSubmit, formatError}: RoomModalProps) {
    // const { t } = useTranslation("conversation");
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
            setError(emptyErrorText);
            return;
        }
        try {
            setSubmitting(true);
            setError(null);
            await onSubmit(trimmedName);
            onClose();
        } catch (err) {
            const rawMessage = err instanceof Error ? err.message : "";
            setError(formatError ? formatError(rawMessage) : rawMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="room-modal__backdrop" role="presentation" onClick={() => { if (!submitting) onClose(); }}>
            <div className="room-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="room-modal-title"
                 onClick={(event) => event.stopPropagation()}>
                <div className="room-modal__header">
                    <h3 id="room-modal-title">{title}</h3>
                    <button type="button" className="room-modal__close" onClick={onClose} disabled={submitting} aria-label={cancelText}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <form className="room-modal__form" onSubmit={handleSubmit}>
                    <div className="room-modal__field">
                        <label htmlFor="room-modal-name-input">{label}</label>
                        <Input id="room-modal-name-input" type="text" value={roomName}
                               onChange={(event) => {
                                   setRoomName(event.target.value);
                                   if (error) setError(null);
                               }}
                               placeholder={placeholder}
                               aria-invalid={Boolean(error)} disabled={submitting} autoFocus />
                    </div>
                    {error && (
                        <p className="room-modal__error" role="alert">{error}</p>
                    )}
                    <div className="room-modal__actions">
                        <Button type="button" variant="secondary" className="btn" onClick={onClose} disabled={submitting}>
                            {cancelText}
                        </Button>
                        <Button type="submit" variant="primary" className="btn" disabled={submitting}>
                            {submitting ? submittingText : submitText}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RoomModal;