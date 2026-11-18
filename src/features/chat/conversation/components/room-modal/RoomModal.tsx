import { useState, type FormEvent } from "react";
import Input from "@/shared/components/Input";
// @ts-ignore
import Button from "@/shared/components/button";
import type { RoomModalMode } from "@/features/chat/conversation/types/conversation";
import "./RoomModal.scss";

interface RoomModalProps {
    isOpen: boolean;
    title: string;
    label: string;
    placeholder: string;
    cancelText: string;
    joinText: string;
    joiningText: string;
    createText: string;
    creatingText: string;
    emptyErrorText: string;
    onClose: () => void;
    onSubmit: (roomName: string, mode: RoomModalMode) => Promise<void>;
    formatError?: (rawMessage: string, mode: RoomModalMode) => string;
}

function RoomModal({isOpen, title, label, placeholder, cancelText, joinText, joiningText, createText, creatingText, emptyErrorText,
                       onClose, onSubmit, formatError}: RoomModalProps) {
    const [roomName, setRoomName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submittingMode, setSubmittingMode] = useState<RoomModalMode | null>(null);

    if (!isOpen) {
        return null;
    }

    const isSubmitting = submittingMode !== null;

    const handleClose = () => {
        if (isSubmitting) return;
        setRoomName("");
        setError(null);
        onClose();
    };

    const handleAction = async (mode: RoomModalMode) => {
        if (isSubmitting) return;
        const trimmedName = roomName.trim();
        if (!trimmedName) {
            setError(emptyErrorText);
            return;
        }
        try {
            setSubmittingMode(mode);
            setError(null);
            await onSubmit(trimmedName, mode);
            setRoomName("");
            setError(null);
            onClose();
        } catch (err) {
            const rawMessage = err instanceof Error ? err.message : "";
            setError(formatError ? formatError(rawMessage, mode) : rawMessage);
        } finally {
            setSubmittingMode(null);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void handleAction("create");
    };

    return (
        <div className="room-modal__backdrop" role="presentation" onClick={handleClose}>
            <div className="room-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="room-modal-title"
                 onClick={(event) => event.stopPropagation()}>
                <div className="room-modal__header">
                    <h3 id="room-modal-title">{title}</h3>
                    <button type="button" className="room-modal__close" onClick={handleClose} disabled={isSubmitting} aria-label={cancelText}>
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
                               aria-invalid={Boolean(error)} disabled={isSubmitting} autoFocus />
                    </div>
                    {error && (
                        <p className="room-modal__error" role="alert">{error}</p>
                    )}
                    <div className="room-modal__actions">
                        <Button type="button" variant="secondary" className="btn" onClick={handleClose} disabled={isSubmitting}>
                            {cancelText}
                        </Button>
                        <Button type="button" variant="outline" className="btn" onClick={() => void handleAction("join")} disabled={isSubmitting}>
                            {submittingMode === "join" ? joiningText : joinText}
                        </Button>
                        <Button type="submit" variant="primary" className="btn" disabled={isSubmitting}>
                            {submittingMode === "create" ? creatingText : createText}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RoomModal;