import type {UploadedMedia} from "@/features/chat/message/types.ts";

export function getCloudinaryMedia(message: string): UploadedMedia | null {
    try {
        const mediaUrl = new URL(message);
        const segments = mediaUrl.pathname.split("/").filter(Boolean);

        if (mediaUrl.hostname !== "res.cloudinary.com" || segments[2] !== "upload") {
            return null;
        }

        const kind = segments[1];
        if (kind !== "image" && kind !== "video") return null;

        const name = segments.at(-1) || "noname";
        const format = name.includes(".") ? name.split(".").pop() || "" : "";
        return {url: mediaUrl.toString(), kind, name, format};
    } catch {
        return null;
    }
}
