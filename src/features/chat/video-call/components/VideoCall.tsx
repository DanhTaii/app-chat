import {useEffect, useRef} from "react";
import {createPeerConnection} from "../hooks/useWebRTC.ts"
import {useMediaStream} from "@/features/chat/video-call/hooks/useMediaStream.ts";
import {
    createAnswerForCallId,
    createOfferForCallId, listenAnswerByCallId,
    listenOfferByCallId
} from "@/features/chat/video-call/api/callService.ts";
import {useParams} from "react-router-dom";
// import {useParams} from "react-router-dom";

export default function VideoCall({}) {
    const {callId} = useParams();
    const currentUserName = localStorage.getItem("username") || "userA";

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
        if (!currentMediaStream || !callId) return;

        // Tạo kết nối WebRTC
        const peerConnection = createPeerConnection();

        // đưa kết nối webrtc vào bộ nhớtajajm useRef
        peerConnectionRef.current = peerConnection;

        // thme video + voice của currentVideo vào kết nối
        // lấy ra tất cả track (video + voice) của MediaStream đưa vào WebRTC
        // duyệt từng strack rồi đưa cho bên B
        currentMediaStream.getTracks().forEach((track) => {
            // thêm track vào kết noiiso WebRTC để chuẩn bị truền cho người B
            peerConnection.addTrack(track, currentMediaStream);
        })

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

        let unsubscribe: (() => void) | undefined;
        let answerHandled = false;
        let offerHandled = false;

        // console.log("KIỂM TRA TÊN HIỆN TẠI: ", currentUserName);
        // console.log("TÊN HIỆN TẠI: :", currentUserName);
        // console.log("TÊN NGƯỜI NHẬN:", receiver);
        if (currentUserName === "userA") {
            console.log("BẮT ĐẦU XỬ LÝ VIDEO BÊN USER A: ")
            const createOffer = async () => {
                try {
                    console.log("A ĐANG LẮNG NGHE");

                    if (!callId) {
                        console.error("Không tìm thấy callId");
                        return;
                    }

                    // người gọi sẽ tạo ra offer
                    const offer = await peerConnection.createOffer();

                    // đặt offer đó ở local của người gọi
                    await peerConnection.setLocalDescription(offer);

                    // tạo và lưu offer lên trên firebase để nnguoif nhận tạo answer
                    await createOfferForCallId(callId, offer);

                    console.log("User A đã gửi Offer");

                    unsubscribe = listenAnswerByCallId(callId, async (answer) => {
                        try {
                            if (answerHandled) return;

                            if (peerConnection.signalingState !== "have-local-offer") {
                                console.log("Không đúng trạng thái để nhận Answer");
                                return;
                            }

                            answerHandled = true;

                            console.log("User A nhận được answer");

                            await peerConnection.setRemoteDescription(
                                new RTCSessionDescription(answer)
                            );

                            console.log("User A đã set Remote");

                        } catch (e) {
                            console.log("Lỗi nhận answer", e);
                        }
                    })
                } catch (e) {
                    console.error("Lỗi khi tạo Offer:", e);
                }
            }

            createOffer();
        } else if (currentUserName === "userB") {
            console.log("BẮT ĐẦU XỬ LÝ VIDEO BÊN USER B: ")
            unsubscribe = listenOfferByCallId(callId, async (offer) => {
                try {
                    console.log("B ĐANG LẮNG NGHE");

                    // -------------- kiểm tra xem đã xử lý offered chưa --------------
                    if (offerHandled) return;

                    if (peerConnection.signalingState !== "stable") {
                        console.log("Không đúng trạng thái để nhận Offer !");
                        return;
                    }

                    offerHandled = true;

                    // -------------- nhận offer twf A --------------
                    await peerConnection.setRemoteDescription(
                        new RTCSessionDescription(offer)
                    );

                    // tạo ra answer
                    const answer = await peerConnection.createAnswer();

                    // lưu answer vào local của B
                    await peerConnection.setLocalDescription(answer)

                    // gửi answer lên firebase
                    await createAnswerForCallId(callId, answer)

                    console.log("User B đã gửi answer");

                } catch (e) {
                    console.error("Lỗi nhận Offer:", e);
                }
            });
        }

        return () => {
            unsubscribe?.();

            peerConnection.close();
            peerConnectionRef.current = null;
        }
    }, [currentMediaStream, callId])

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
