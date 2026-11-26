import {useEffect, useState} from "react";

export const useMediaStream = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        let mediaStream: MediaStream | null = null;
        let cancelled = false;

        const startCamera = async () => {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                // Nếu Effect cũ đã cleanup thì dừng stream vừa nhận
                if (cancelled) {
                    newStream.getTracks().forEach(track => track.stop());
                    return;
                }

                mediaStream = newStream;
                setStream(newStream);

            } catch (error) {
                if (!cancelled) {
                    console.error("Không thể truy cập camera:", error);
                }
            }
        };

        startCamera();

        return () => {
            cancelled = true;

            mediaStream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    return stream;
};