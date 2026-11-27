import {useEffect, useRef, useState} from "react";
import {createPeerConnection} from "../hooks/useWebRTC.ts"
import {useMediaStream} from "@/features/chat/video-call/hooks/useMediaStream.ts";
import {
    createAnswerForCallId, createIceCandidateByCallId,
    createOfferForCallId, getCallParticipants, listenAnswerByCallId, listenIceCandidateByCallId,
    listenOfferByCallId
} from "@/features/chat/video-call/api/callService.ts";
import type {CallParticipants} from "@/features/chat/video-call/api/callService.ts";
import {useAppSelector} from "@/app/store/hooks.ts";
import {useParams} from "react-router-dom";
import "./VideoCall.scss"
// import {useParams} from "react-router-dom";

export default function VideoCall() {
    const {callId} = useParams();
    const currentUserName = useAppSelector(
        (state) => state.auth.user?.username
    );
    const [callParticipants, setCallParticipants] = useState<CallParticipants | null>(null);
    const [callError, setCallError] = useState<string | null>(null);

    // ------- quản lý kết nối webrtc

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

    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    useEffect(() => {
        let active = true;
        setCallParticipants(null);
        setCallError(null);

        if (!callId) {
            setCallError("Không tìm thấy mã cuộc gọi.");
            return () => {
                active = false;
            };
        }

        getCallParticipants(callId)
            .then((participants) => {
                if (!active) return;
                if (!participants) {
                    setCallError("Không tìm thấy thông tin người tham gia cuộc gọi.");
                    return;
                }
                setCallParticipants(participants);
            })
            .catch((error) => {
                if (!active) return;
                console.error("Không thể tải thông tin cuộc gọi:", error);
                setCallError("Không thể tải thông tin cuộc gọi.");
            });

        return () => {
            active = false;
        };
    }, [callId]);

    const toggleCamera = () => {
        if (!currentMediaStream) {
            console.log("MEDIA KHÔNG NHẬN DIỆN ĐƯC !")
            return;
        }

        const videoTracks = currentMediaStream.getVideoTracks();

        videoTracks.forEach((track) => {
            track.enabled = !track.enabled;
        });

        setIsCameraOn((prev) => !prev);
    }

    const toggleMic = () => {
        if (!currentMediaStream) return;

        const audioTracks = currentMediaStream.getAudioTracks();

        audioTracks.forEach((track) => {
            track.enabled = !track.enabled;
        });

        setIsMicOn((prev) => !prev);
    };

    useEffect(() => {
        if (currentVideoRef.current && currentMediaStream) {
            // gán địa chỉ đường ống Media vào bộ nhớ ngầm
            // đây là chỗ mà nó thực hiện truyền video real time
            // vì bên useMediaStream đã được chấp nhận dùng camera nó sẽ lưu cái media như camera + voice
            currentVideoRef.current.srcObject = currentMediaStream;
        }
    }, [currentMediaStream]);


    useEffect(() => {
        if (!currentMediaStream || !callId || !currentUserName || !callParticipants) return;

        const isCaller = currentUserName === callParticipants.caller;
        const isReceiver = currentUserName === callParticipants.receiver;
        if (!isCaller && !isReceiver) {
            setCallError("Tài khoản hiện tại không thuộc cuộc gọi này.");
            return;
        }

        setCallError(null);
        const remoteUser = isCaller ? callParticipants.receiver : callParticipants.caller;

        let cancelled = false;

        const peerConnection = createPeerConnection();

        peerConnectionRef.current = peerConnection;

        // thme video + voice của currentVideo vào kết nối
        // lấy ra tất cả track (video + voice) của MediaStream đưa vào WebRTC
        // duyệt từng strack rồi đưa cho bên B
        currentMediaStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, currentMediaStream);
        });

        // kiểm tra trạng thía kết nối
        peerConnection.onconnectionstatechange = async () => {
            console.log("TRẠNG THÍA KẾT NỐI", peerConnection.connectionState);
        }

        // kiểm tra trạng thái ice candidate
        peerConnection.oniceconnectionstatechange = () => {
            console.log("ICE STATE:", peerConnection.iceConnectionState);
        };

        // bên B nhận được video/voice wf người A
        // tức là trong peerConnection có track mới nó sẽ cập nhật
        peerConnection.ontrack = (event) => {
            const remoteVideo = remoteVideoRef.current;

            if (!remoteVideo) return;

            const remoteStream = event.streams[0];

            if (!remoteStream) return;

            remoteVideo.srcObject = remoteStream;
        };

        // Danh sách các candidate đang chờ để được xử lý
        // do có theer các ice candidate sẽ đến trước cả khi answer và offer ở cả userA và userB được theiets lập description
        // candidate phải có description ở local vs remote mới hoạt động được
        // nên để đảm bảo thì ta sẽ lưu vào 1 mảng khi đã có description thì thêm nó vào peerConnection
        const pendingCandidates: RTCIceCandidateInit[] = [];

        const handleIncomingCandidate = async (candidate: RTCIceCandidateInit) => {
            try {
                if (!peerConnection.remoteDescription) {
                    pendingCandidates.push(candidate);
                    // console.log("ICE Candidate đang chờ:", candidate);
                    return;
                }

                await peerConnection.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );

                // console.log("NHẬN ICE CANDIDATE TỪ ĐỐI PHƯƠNG:", candidate.candidate);
            } catch (e) {
                console.log("LOOIX THÊM CANDIDATE: ", e)
            }
        }

        peerConnection.onicecandidate = async (event) => {
            if (cancelled) return;

            if (event.candidate) {
                try {
                    await createIceCandidateByCallId(
                        callId,
                        currentUserName,
                        event.candidate
                    );

                } catch (e) {
                    if (!cancelled) {
                        console.error("LỖI GỬI ICE:", e);
                    }
                }
            } else {
                console.log("ICE GATHERING ĐÃ HOÀN TẤT");
            }
        };

        // để quản lý toàn bộ Firebase listener
        // khi useEffect được cleanup thì nó cũng sẽ hủy toàn bộ (ở dưới, phần return)
        const unsubscribes: (() => void)[] = [];

        const addUnsubscribe = (unsubscribe: () => void) => {
            if (cancelled) {
                unsubscribe();
                return;
            }

            unsubscribes.push(unsubscribe);
        };

        // 2 biến này đảm bảo vieejc userA và userB sẽ chỉ tạo ra và xử lý answer và offer 1 lần
        // do trên firebase có theer thay đổi liên tục
        let answerHandled = false;
        let offerHandled = false;

        // Hm xử lý danh sách các ice candidate đang chờ được xử lý
        const flushPendingCandidates = async () => {
            for (const candidate of pendingCandidates) {
                await peerConnection.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );
            }

            pendingCandidates.length = 0;
        };

        addUnsubscribe(
            listenIceCandidateByCallId(callId, remoteUser,
                async (candidate) => {
                    if (cancelled) return;

                    await handleIncomingCandidate(candidate);
                }
            )
        );

        // console.log("KIỂM TRA TÊN HIỆN TẠI: ", currentUserName);
        // console.log("TÊN HIỆN TẠI: :", currentUserName);
        // console.log("TÊN NGƯỜI NHẬN:", receiver);
        if (isCaller) {
            console.log("BẮT ĐẦU XỬ LÝ VIDEO BÊN USER A: ")
            const createOffer = async () => {
                try {
                    // -----------
                    if (cancelled) return;

                    const offer = await peerConnection.createOffer();

                    // -----------
                    if (cancelled) return;

                    await peerConnection.setLocalDescription(offer);

                    // -----------
                    if (cancelled) return;

                    await createOfferForCallId(callId, offer);

                    // -----------
                    if (cancelled) return;

                    addUnsubscribe(
                        listenAnswerByCallId(callId, async (answer) => {
                            try {
                                // -----------
                                if (cancelled || answerHandled) return;

                                if (peerConnection.signalingState !== "have-local-offer") {
                                    console.log("Không đúng trạng thái để nhận Answer");
                                    return;
                                }

                                await peerConnection.setRemoteDescription(
                                    new RTCSessionDescription(answer)
                                );

                                // -----------
                                if (cancelled) return;

                                answerHandled = true;

                                await flushPendingCandidates();

                            } catch (e) {
                                console.log("Lỗi nhận answer", e);
                            }
                        })
                    );

                } catch (e) {
                    if (!cancelled) {
                        console.error("Lỗi khi tạo Offer:", e);
                    }
                }
            };

            createOffer();
        } else {
            console.log("BẮT ĐẦU CHỜ OFFER:")
            addUnsubscribe(
                listenOfferByCallId(callId, async (offer) => {
                    try {
                        // -----------
                        if (cancelled || offerHandled) return;

                        if (peerConnection.signalingState !== "stable") {
                            return;
                        }

                        // Đánh dấu ngay để tránh xử lý Offer đồng thời
                        offerHandled = true;

                        await peerConnection.setRemoteDescription(
                            new RTCSessionDescription(offer)
                        );

                        // -----------
                        if (cancelled) return;

                        await flushPendingCandidates();

                        // -----------
                        if (cancelled) return;

                        const answer = await peerConnection.createAnswer();

                        // -----------
                        if (cancelled) return;

                        await peerConnection.setLocalDescription(answer);

                        // -----------
                        if (cancelled) return;

                        await createAnswerForCallId(callId, answer);

                    } catch (e) {
                        if (!cancelled) {
                            console.error("Lỗi nhận Offer:", e);
                        }
                    }
                })
            );
        }

        return () => {
            // Báo cho toàn bộ tác vụ async biết Effect đã bị hủy
            cancelled = true;

            // Hủy tất cả Firebase listeners
            unsubscribes.forEach((unsubscribe) => unsubscribe());

            // Gỡ các event handlers
            peerConnection.onicecandidate = null;
            peerConnection.ontrack = null;
            peerConnection.onconnectionstatechange = null;
            peerConnection.oniceconnectionstatechange = null;

            // Đóng kết nối
            peerConnection.close();

            // Chỉ xóa ref nếu nó vẫn đang trỏ đến PeerConnection này
            if (peerConnectionRef.current === peerConnection) {
                peerConnectionRef.current = null;
            }
        };
    }, [currentMediaStream, callId, currentUserName, callParticipants])

    return (
        <div className="video-call-container">
            <h2>VIDEO CALL</h2>
            {callError && <p role="alert">{callError}</p>}
            {!currentUserName && <p role="status">Đang xác thực người dùng…</p>}

            <div className="video-wrapper">
                {/* Video của bản thân */}
                <div className="video-item">
                    <h3>Video của tôi</h3>

                    <video
                        ref={currentVideoRef}
                        autoPlay
                        muted
                        playsInline
                    />
                </div>

                {/* Video của đối phương */}
                <div className="video-item">
                    <h3>Video đối phương</h3>

                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                    />
                </div>
            </div>

            <div className="video-controls">
                <button onClick={toggleCamera}>
                    {isCameraOn ? "Tắt camera" : "Bật camera"}
                </button>

                <button onClick={toggleMic}>
                    {isMicOn ? "Tắt microphone" : "Bật microphone"}
                </button>
            </div>
        </div>
    );
}
