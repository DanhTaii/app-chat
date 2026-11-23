import { useState, type FormEvent } from "react";
import Input from "@/shared/components/Input";
// @ts-ignore
import Button from "@/shared/components/button";
import type { RoomModalMode, RoomModalTab } from "@/features/chat/conversation/types/conversation";
import "./RoomModal.scss";

interface RoomModalProps {
    isOpen: boolean;
    title: string;
    tabDirectText: string;
    tabGroupText: string;
    directLabel: string;
    directPlaceholder: string;
    directSubmitText: string;
    checkingUserText: string;
    directEmptyErrorText: string;
    label: string;
    placeholder: string;
    cancelText: string;
    joinText: string;
    joiningText: string;
    createText: string;
    creatingText: string;
    emptyErrorText: string;
    onClose: () => void;
    onSubmit: (targetName: string, mode: RoomModalMode) => Promise<void>;
    formatError?: (rawMessage: string, mode: RoomModalMode) => string;
}

function RoomModal({isOpen, title, tabDirectText, tabGroupText, directLabel, directPlaceholder, directSubmitText, checkingUserText,
                       directEmptyErrorText, label, placeholder, cancelText, joinText, joiningText, createText, creatingText,
                       emptyErrorText, onClose, onSubmit, formatError}: RoomModalProps) {
    const [activeTab, setActiveTab] = useState<RoomModalTab>("direct");
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submittingMode, setSubmittingMode] = useState<RoomModalMode | null>(null);

    if (!isOpen) {
        return null;
    }

    const isSubmitting = submittingMode !== null;
    const isDirectTab = activeTab === "direct";

    const handleTabChange = (tab: RoomModalTab) => {
        if (isSubmitting || tab === activeTab) return;
        setActiveTab(tab);
        setInputValue("");
        setError(null);
    };

    const handleClose = () => {
        if (isSubmitting) return;
        setInputValue("");
        setError(null);
        onClose();
    };

    const handleAction = async (mode: RoomModalMode) => {
        if (isSubmitting) return;
        const trimmedName = inputValue.trim();
        if (!trimmedName) {
            setError(mode === "direct" ? directEmptyErrorText : emptyErrorText);
            return;
        }
        try {
            setSubmittingMode(mode);
            setError(null);
            await onSubmit(trimmedName, mode);
            setInputValue("");
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
        void handleAction(isDirectTab ? "direct" : "create");
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
                <div className="room-modal__tabs" role="tablist">
                    <button type="button" role="tab" aria-selected={isDirectTab}
                            className={isDirectTab ? "room-modal__tab room-modal__tab--active" : "room-modal__tab"}
                            onClick={() => handleTabChange("direct")} disabled={isSubmitting}>
                        {tabDirectText}
                    </button>
                    <button type="button" role="tab" aria-selected={!isDirectTab}
                            className={!isDirectTab ? "room-modal__tab room-modal__tab--active" : "room-modal__tab"}
                            onClick={() => handleTabChange("group")} disabled={isSubmitting}>
                        {tabGroupText}
                    </button>
                </div>
                <form className="room-modal__form" onSubmit={handleSubmit}>
                    <div className="room-modal__field">
                        <label htmlFor="room-modal-name-input">{isDirectTab ? directLabel : label}</label>
                        <Input id="room-modal-name-input" type="text" value={inputValue}
                               onChange={(event) => {
                                   setInputValue(event.target.value);
                                   if (error) setError(null);
                               }}
                               placeholder={isDirectTab ? directPlaceholder : placeholder}
                               aria-invalid={Boolean(error)} disabled={isSubmitting} autoFocus />
                    </div>
                    {error && (
                        <p className="room-modal__error" role="alert">{error}</p>
                    )}
                    <div className="room-modal__actions">
                        <Button type="button" variant="secondary" className="btn" onClick={handleClose} disabled={isSubmitting}>
                            {cancelText}
                        </Button>
                        {isDirectTab ? (
                            <Button type="submit" variant="primary" className="btn" disabled={isSubmitting}>
                                {submittingMode === "direct" ? checkingUserText : directSubmitText}
                            </Button>
                        ) : (
                            <>
                                <Button type="button" variant="outline" className="btn" onClick={() => void handleAction("join")} disabled={isSubmitting}>
                                    {submittingMode === "join" ? joiningText : joinText}
                                </Button>
                                <Button type="submit" variant="primary" className="btn" disabled={isSubmitting}>
                                    {submittingMode === "create" ? creatingText : createText}
                                </Button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RoomModal;