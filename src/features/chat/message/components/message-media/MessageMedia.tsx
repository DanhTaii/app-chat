import "./MessageMedia.scss";
import type {UploadedMedia} from "@/features/chat/message/types.ts";

interface MessageMediaProps {
    media: UploadedMedia;
}

export default function MessageMedia({media}: MessageMediaProps) {
    return (
        <div className="message-media">
            {media.kind === "image" ? (
                <img src={media.url} alt={media.name} loading="lazy" />
            ) : (
                <video src={media.url} controls preload="metadata" aria-label={media.name} />
            )}
            <span className="message-media__name">{media.name}</span>
        </div>
    );
}
