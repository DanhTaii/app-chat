import type {UploadedMedia} from "@/features/chat/message/types.ts";

export default function MediaTile({media}: {media: UploadedMedia}) {
    return (
        <div className="resource__media-item" title={media.name}>
            {media.kind === "image" ? (
                <a href={media.url} target="_blank" rel="noreferrer" aria-label={`Mở ảnh này ${media.name}`}>
                    <img src={media.url} alt={media.name} loading="lazy" />
                </a>
            ) : (
                <video src={media.url} controls preload="metadata" aria-label={media.name} />
            )}
        </div>
    );
}
