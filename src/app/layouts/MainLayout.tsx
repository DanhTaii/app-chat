import "./MainLayout.scss";
import {Outlet, useLocation} from "react-router-dom";
// import {Link} from "react-router-dom";
import {ROUTES} from "../router/routes";
// import {useTranslation} from "react-i18next";
// import {useState} from "react";
// import {
//     applyTheme,
//     getInitialTheme,
//     type Theme,
// } from "../../shared/utils/theme";
import Sidebar from "./Sidebar";
// import chatSocket from "@/shared/services/socket/socketService.ts";
// import chatSocket from "@/shared/api/socket/socketService.ts";
import {createCall, listenCallStatus} from "@/features/chat/video-call/api/callService.ts";
import IncomingCallListener from "@/features/chat/video-call/components/incoming-call-listener/IncomingCallListener.tsx";
import {useEffect, useRef, useState} from "react";
import VideoCall from "@/features/chat/video-call/components/VideoCall.tsx";

// import chatSocket from "@/shared/api/socket/socketService.ts";

function MainLayout() {
    // const {i18n} = useTranslation();
    // const [currentLanguage, setCurrentLanguage] = useState("vi");
    // const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const {pathname} = useLocation();
    const showSidebar = pathname.startsWith(ROUTES.CHAT);

    // Trạng thái khi 1 người dùng bấm call cho 1 người kahsc
    // => ringing, accept, reject
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

        // sau khi gọi hàm listenCallStatus nó sẽ trả về 1 hàm hủy đăng ký lắng nghe
        unsubscribeRef.current = listenCallStatus(
            callId,
            (status) => {
                console.log("CALL STATUS:", status);
                setCallStatus(status || "");

                if (status == "accepted") {
                    setCurrentCallId(callId)
                    setIsInCall(true)
                }
            }
        );
    };

    // Xử lý khi bên màn hình của receiver chấp nhận
    // để màn hình video hiển thị lên
    const handleAccepted = (callId: string) => {
        setCurrentCallId(callId);
        setIsInCall(true);
    };

    return (
        <div className="main-layout">

            <IncomingCallListener onAccepted={handleAccepted}/>

            {isInCall && currentCallId && (
                <div>
                    <VideoCall/>
                </div>
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
