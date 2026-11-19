import {useEffect, useState} from "react";
import "./IncomingCallListener.scss";
import {
    listenIncomingCall,
    acceptCall,
    rejectCall
} from "@/features/chat/video-call/api/callService";
import Button from "@/shared/components/button.tsx";

// @ts-ignore
export default function IncomingCallListener({onAccepted}) {

    const currentUserName = localStorage.getItem("username") || "userB";

    const [incomingCall, setIncomingCall] = useState<any>(null);

    useEffect(() => {

        const unsubscribe = listenIncomingCall(
            currentUserName,
            (call) => {
                console.log("CÓ CUỘC GỌI ĐẾN:", call);

                // Cập nhật state để React render lại giao diện
                setIncomingCall(call);
            }
        );

        return () => unsubscribe();

    }, []);

    const handleAccept = async () => {
        const callId = incomingCall.callId;

        await acceptCall(callId);

        setIncomingCall(null);

        onAccepted(callId)

        console.log("ĐÃ CHẤP NHẬN CUỘC GỌI");
    };

    const handleReject = async () => {
        await rejectCall(incomingCall.callId);

        setIncomingCall(null);

        console.log("ĐÃ TỪ CHỐI CUỘC GỌI");
    };

    // Không có cuộc gọi thì không hiển thị
    if (!incomingCall) return null;

    return (
        <div className="notify-overlay">
            <div className="notify-call">
                <h3>Có cuộc gọi đến!</h3>
                <p>Người gọi: {incomingCall.caller}</p>
                <p>Trạng thái: {incomingCall.status}</p>

                <div className="notify-call_choice">
                    <Button
                        variant="primary"
                        className="btn accept-btn"
                        type="submit"
                        onClick={handleAccept}
                    >
                        <i className="fa-solid fa-phone"></i>
                    </Button>

                    <Button
                        variant="primary"
                        className="btn reject-btn"
                        type="submit"
                        onClick={handleReject}
                    >
                        <i className="fa-solid fa-phone-slash"></i>
                    </Button>
                </div>
            </div>
        </div>
    );
}
