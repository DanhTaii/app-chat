
import { useEffect, useRef } from "react";

export default function VideoCall() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let stream: MediaStream;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

            } catch (e) {
                console.error("Không thể truy cập camera:", e);
            }
        };

        startCamera();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    return (
        <div>
            <h2>VIDEO CALL</h2>

            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                width={400}
            />
        </div>
    );
}
