import {useEffect, useRef} from "react";
import {createPeerConnection} from "../hooks/useWebRTC.ts"
import {useMediaStream} from "@/features/chat/video-call/hooks/useMediaStream.ts";
// import {useParams} from "react-router-dom";

export default function VideoCall() {
    // const {callId} = useParams();

    // ------- quản lý kết nối webrtc
    // const videoRef = useRef<HTMLVideoElement>(null);
    // tạo 1 kết nối ngang hàng giữa 2 người (wweb rtc)
    // phải lưu trong useRef nếu không muốn nos cữ mỗi lần component render lại thif tạo kết ối mưới
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    // -------- phần quản lý video + voice
    // Video củanguowuoiwf gọi
    const currentVideoRef = useRef<HTMLVideoElement>(null);
    // video của người nhận
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    // lưu camera + voice của mình
    const currentMediaStream = useMediaStream();

    useEffect(() => {
        if (currentVideoRef.current && currentMediaStream) {
            // gán địa chỉ đường ống Media vào bộ nhớ ngầm
            // đây là chỗ mà nó thực hiện truyền video real time
            // vì bên useMediaStream đã được chấp nhận dùng camera nó sẽ lưu cái media như camera + voice
            currentVideoRef.current.srcObject = currentMediaStream;
        }
    }, [currentMediaStream]);


    useEffect(() => {
        // Tạo kết nối WebRTC
        const peerConnection = createPeerConnection();

        console.log("PeerConnection:", peerConnection);
        console.log("Connection state:", peerConnection.connectionState);
        console.log("ICE state:", peerConnection.iceConnectionState);

        // đưa kết nối webrtc vào bộ nhớtajajm useRef
        peerConnectionRef.current = peerConnection;

        // thme video + voice của currentVideo vào kết nối
        if (currentMediaStream) {
            // lấy ra tất cả track (video + voice) của MediaStream đưa vào WebRTC
            // duyệt từng strack rồi đưa cho bên B
            currentMediaStream.getTracks().forEach((track) => {
                console.log("Track:", track.kind);
                console.log("Track enabled:", track.enabled);
                console.log("Track readyState:", track.readyState);

                // thêm track vào kết noiiso WebRTC để chuẩn bị truền cho người B
                peerConnection.addTrack(track, currentMediaStream);
            })
        }

        // bên B nhận được video/voice wf người A
        // tức là trong peerConnection có track mới nó sẽ cập nhật
        peerConnection.ontrack = (event) => {
            console.log("Đã nhận stream từ người bên kia");
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        }

        // kiểm tra trạng thía kết nối
        peerConnection.onconnectionstatechange = () => {
            console.log(
                "TRẠNG THÍA KẾT NỐI",
                peerConnection.connectionState
            )
        }

        return () => {
            peerConnection.close();
            peerConnectionRef.current = null;
        }
    }, [currentMediaStream])

    return (
        <div>
            <h2>VIDEO CALL</h2>

            <video
                ref={currentVideoRef}
                autoPlay
                muted
                playsInline
                width={400}
            />

            <video
                ref={remoteVideoRef}
                autoPlay
                muted
                playsInline
                width={400}
            />
        </div>
    );
}
