import "./MainLayout.scss";
import {Outlet, useLocation} from "react-router-dom";
import {ROUTES} from "../router/routes";
import Sidebar from "./Sidebar";
import {cancelCall, createCall, listenCallStatus} from "@/features/chat/video-call/api/callService.ts";
import IncomingCall
    from "@/features/chat/video-call/components/incoming-call/IncomingCall.tsx";
import {useEffect, useRef, useState} from "react";
import WaitingCall from "@/features/chat/video-call/components/waiting-call/WaitingCall.tsx";

function MainLayout() {
    const {pathname} = useLocation();
    const showSidebar = pathname.startsWith(ROUTES.CHAT);

    // Trạng thái khi 1 người dùng bấm call cho 1 người kahsc
    // => ringing, accept, reject, cancel
    const [callStatus, setCallStatus] = useState("");
    // biến để lưu hàm hủy đăng ký lắng nghe
    const unsubscribeRef = useRef<(() => void) | null>(null);
    // lưu lại mã ID mà 2 người call nhau
    const [currentCallId, setCurrentCallId] = useState<string | null>(null);
    // để xem coi 2 người này có đang trong 1 cuộc call khoiong ?
    const [isInCall, setIsInCall] = useState(false)

    const currentUserName = localStorage.getItem("username") || "userA";

    // hủy đăng ký lắng nghe firebase khi components MainLayout bị gỡ khởi giao diện
    useEffect(() => {
        return () => {
            unsubscribeRef.current?.();
        };
    }, []);

    const handleCall = async () => {
        // hủy lắng nghe cuộc gọi trước nếu có
        unsubscribeRef.current?.();

        setCallStatus("ringing");

        const receiver = currentUserName === "userA" ? "userB" : "userA";

        // tạo ra cuộc gọi và lấy mã ID
        const callId = await createCall(
            currentUserName,
            receiver
        );

        console.log("Call ID:", callId);
        setCurrentCallId(callId)

        // sau khi gọi hàm listenCallStatus nó sẽ trả về 1 hàm hủy đăng ký lắng nghe
        unsubscribeRef.current = listenCallStatus(callId, (status) => {
                console.log("CALL STATUS:", status);
                setCallStatus(status || "");

                if (status == "accepted") {
                    setCurrentCallId(callId)
                    setIsInCall(true)

                    const newTab = window.open("", "_blank");
                    if (newTab) {
                        newTab.location.href = `/video-call/${callId}`;
                    }
                }
            }
        );
    };

    // Xử lý khi bên màn hình của receiver chấp nhận
    // để màn hình video hiển thị lên
    const handleAccept = (callId: string) => {
        setCurrentCallId(callId);
        setIsInCall(true);
    };

    const handleCancel = async () => {
        if (currentCallId) {
            await cancelCall(currentCallId);
        }

        unsubscribeRef.current?.();
        unsubscribeRef.current = null;

        setCallStatus("");
        setCurrentCallId(null);
        setIsInCall(false);
    };

    return (
        <div className="main-layout">

            <IncomingCall onAccepted={handleAccept}/>

            {callStatus === "ringing" && (
                <WaitingCall
                    receiver={
                        currentUserName === "userA"
                            ? "User B"
                            : "User A"
                    }
                    onCancel={handleCancel}
                />
            )}

            <nav>
                <button onClick={handleCall}>
                    Gọi điện
                </button>

                {callStatus === "ringing" && (
                    <p>Đang chờ người nhận...</p>
                )}

                {callStatus === "accepted" && (
                    <p>Người nhận đã chấp nhận cuộc gọi!</p>
                )}

                {callStatus === "rejected" && (
                    <p>Người nhận đã từ chối cuộc gọi!</p>
                )}

                {callStatus === "error" && (
                    <p>Không thể thực hiện cuộc gọi!</p>
                )}
            </nav>

            <div className="main-layout__body">
                {showSidebar ? <Sidebar/> : null}

                <main className="main-layout__content">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
