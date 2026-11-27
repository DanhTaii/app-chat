import ConversationList from '../conversation/components/ConversationList.tsx'
import MessageWindow from '../message/components/MessageWindow.tsx'
import './chat-page.scss'
import InfoPanel from "@/features/chat/info-panel/components/InfoPanel.tsx";
import {useEffect, useRef, useState} from "react";
import {useAppSelector} from "@/app/store/hooks.ts";
import {getCloudinaryMedia} from "@/features/chat/message/utils/getCloudinaryMedia.ts";
import type {UploadedMedia} from "@/features/chat/message/types.ts";
import IncomingCall from "@/features/chat/video-call/components/incoming-call/IncomingCall.tsx";
import WaitingCall from "@/features/chat/video-call/components/waiting-call/WaitingCall.tsx";
import {cancelCall, createCall, listenCallStatus} from "@/features/chat/video-call/api/callService.ts";

// chỉ ghép Conversation và Message
function ChatPage() {
    const [isInfoOpen, setIsInfoOpen] = useState(true);

    // 1 là room chat |
    // 0 là people chat
    //
    // const receiverName = "Wabisoo_";
    // const typeConversation = 0;

    // const receiverName = "Lớp Karate thầy Quang"
    // const typeConversation = 1;
    const selectedConversation = useAppSelector((state) => state.conversation.selectedConversation);
    const receiverName = selectedConversation?.name ?? "";
    const typeConversation = selectedConversation?.type ?? null;
    const currentUserName = useAppSelector(
        (state) => state.auth.user?.username
    );
    const messages = useAppSelector(state => state.message.conversations[receiverName]?.messages ?? []);
    const mediaMessages: UploadedMedia[] = [];
    messages.forEach(message => {
        const media = getCloudinaryMedia(message.mes);
        if (media) mediaMessages.push(media);
    });

    // các biến xử lý video call
    const [callStatus, setCallStatus] = useState("");
    const unsubscribeRef = useRef<(() => void) | null>(null);
    const [currentCallId, setCurrentCallId] = useState<string | null>(null);

    const handleToggleInfo = () => {
        // prev là giá trị state trước khi cập nhật.
        setIsInfoOpen(prev => !prev)
    }

    useEffect(() => {
        return () => {
            unsubscribeRef.current?.();
        };
    }, []);

    const handleCall = async () => {
        if (
            !currentUserName ||
            !selectedConversation ||
            selectedConversation.type !== 0 ||
            !receiverName ||
            callStatus === "starting" ||
            callStatus === "ringing"
        ) {
            return;
        }

        unsubscribeRef.current?.();
        unsubscribeRef.current = null;

        setCallStatus("starting");
        setCurrentCallId(null);

        try {
            const callId = await createCall(currentUserName, receiverName);
            setCurrentCallId(callId);
            setCallStatus("ringing");

            unsubscribeRef.current = listenCallStatus(callId, (status) => {
                setCallStatus(status || "");

                if (status === "accepted") {
                    const callWindow = window.open(`/video-call/${callId}`, "_blank");
                    if (!callWindow) {
                        setCallStatus("popup-blocked");
                    }
                } else if (status === "rejected" || status === "cancelled") {
                    setCurrentCallId(null);
                }
            });
        } catch (error) {
            console.error("Không thể tạo cuộc gọi:", error);
            setCurrentCallId(null);
            setCallStatus("error");
        }
    };

    const handleAccept = (callId: string) => {
        setCurrentCallId(callId);
        setCallStatus("accepted");
    };

    const handleCancel = async () => {
        if (!currentCallId) return;

        try {
            await cancelCall(currentCallId);
        } catch (error) {
            console.error("Không thể hủy cuộc gọi:", error);
            setCallStatus("ringing");
            return;
        }

        unsubscribeRef.current?.();
        unsubscribeRef.current = null;

        setCallStatus("");
        setCurrentCallId(null);
    };

    const canCall = Boolean(
        currentUserName && selectedConversation?.type === 0 && receiverName
    );

    return (
        <div className={`chat-page ${isInfoOpen ? 'info-open' : ''}`}>
            {currentUserName && (
                <IncomingCall
                    currentUserName={currentUserName}
                    onAccepted={handleAccept}
                />
            )}

            {(callStatus === "starting" || callStatus === "ringing") && (
                <WaitingCall
                    receiver={receiverName}
                    onCancel={handleCancel}
                    isCancelDisabled={callStatus === "starting"}
                />
            )}

            <ConversationList/>
            <MessageWindow onToggleInfo={handleToggleInfo} receiverName={receiverName}
                           conversationType={typeConversation} onCall={handleCall}
                           isCallDisabled={!canCall || callStatus === "starting" || callStatus === "ringing"}
            />

            {/* Cú pháp Conditional Rendering nếu isInforOpen là true thì sẽ render InfoPanel*/}
            {isInfoOpen && <InfoPanel mediaMessages={mediaMessages}/>}
        </div>
    )
}

export default ChatPage
