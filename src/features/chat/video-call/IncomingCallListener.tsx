
import { useEffect, useState } from "react";

import {
    listenIncomingCall,
    acceptCall,
    rejectCall
} from "@/features/chat/video-call/services/callService";

export default function IncomingCallListener() {

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
        await acceptCall(incomingCall.callId);

        setIncomingCall(null);

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
        <div style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 99999,
            background: "white",
            color: "black",
            padding: "24px",
            border: "2px solid green",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
        }}>

            <h3>Có cuộc gọi đến!</h3>

            <p>
                Người gọi: {incomingCall.caller}
            </p>

            <p>
                Trạng thái: {incomingCall.status}
            </p>

            <button onClick={handleAccept}>
                Chấp nhận
            </button>

            <button
                onClick={handleReject}
                style={{ marginLeft: "10px" }}
            >
                Từ chối
            </button>

        </div>
    );
}
