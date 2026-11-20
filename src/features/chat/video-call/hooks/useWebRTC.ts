export const createPeerConnection = () => {
    // tajo ra một đối tượng webrt để quản lý ết nối giữa 2 người
    const peerConnection = new RTCPeerConnection({
        iceServers: [
            {
                // STUN server (của google) giúp trình duyt xc định địa ch mạng
                // mà nó có thể dùng để kết nối với người còn lại
                urls: "stun:stun.l.google.com:19302"
            }
        ]
    })

    console.log("ĐÃ TẠO RTCPeerConnection");

    return peerConnection;
}