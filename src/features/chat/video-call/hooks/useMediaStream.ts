import {useEffect, useState} from "react";

// dnajg custom hook: tự quản lý state stream ngay bên trong nó rồi return kết quả ra bên ngoiaf
// chỉ có nhiệm vụ khởi tạo camera đúng 1 lần duy nhất nên không cần biến phụ thuộc
export const useMediaStream = () => {
    // khi khai báo ở đây và VideoCall Component gọi hàm useMediaStream
    // thì lúc này state stream ở đây lúc được gán thẳng vào bộ nhớ của VideoCall
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        let mediaStream: MediaStream | null = null
        const startCamera = async () => {
            try {
                // Xin quền truy cập data từ camera + voice
                // nó trả về 1 đường ống dữ liệu (hiểu như Socket)
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                // xin được thì setMediaStream, khi bt có cập nhật
                // component VideoCall nhận được thay đổi do hàm useMediaStream trong component
                // react sẽ y/c VideoCall cập nhật lại
                // choox nàychirir cho component cha biết địa chỉ của đường ống đó
                setStream(mediaStream);

            } catch (e) {
                console.error("Không thể truy cập camera:", e);
            }
        };

        startCamera();

        return () => {
            // lấy tất cả các track của stream
            mediaStream?.getTracks().forEach(
                // track có theer là video haowjc audio
                track => track.stop()
            );
        };
    }, []);

    // trả về địa chỉ đường ống Media
    return stream;
}

