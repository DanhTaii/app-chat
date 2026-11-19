import type {MediaKind, UploadedMedia} from "@/features/chat/message/types.ts";

const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const VIDEO_MAX_SIZE = 50 * 1024 * 1024; // 50MB

// dinh dang ho tro
const supportedTypes: Record<string, {kind: MediaKind; format: string}> = {
    "image/jpeg": {kind: "image", format: "jpg"},
    "image/png": {kind: "image", format: "png"},
    "image/webp": {kind: "image", format: "webp"},
    "video/mp4": {kind: "video", format: "mp4"},
    "video/webm": {kind: "video", format: "webm"},
};

export async function uploadMedia(file: File): Promise<UploadedMedia> {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();

    if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary chưa được cấu hình. Hãy điền CLOUD_NAME và UPLOAD_PRESET trong file .env.");
    }

    const mediaType = supportedTypes[file.type];
    if (!mediaType) {
        throw new Error("Định dạng không được hỗ trợ. Hãy chọn JPG, JPEG, PNG, WEBP, MP4 hoặc WEBM.");
    }

    const allowedExtensions = mediaType.kind === "image"
        ? ["jpg", "jpeg", "png", "webp"]
        : ["mp4", "webm"];
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
        throw new Error("Phần mở rộng tệp không khớp với định dạng được hỗ trợ.");
    }

    const maxSize = mediaType.kind === "image" ? IMAGE_MAX_SIZE : VIDEO_MAX_SIZE;
    if (file.size > maxSize) {
        throw new Error(mediaType.kind === "image"
            ? "Ảnh vượt quá dung lượng tối đa 10 MB."
            : "Video vượt quá dung lượng tối đa 50 MB.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    let response: Response;
    try {
        response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/auto/upload`, {
            method: "POST",
            body: formData,
        });
    } catch {
        throw new Error("Không thể kết nối Cloudinary.");
    }

    const result = await response.json().catch(() => null) as {
        secure_url?: string;
        format?: string;
        error?: {message?: string};
    } | null;

    if (!response.ok || !result?.secure_url) {
        throw new Error(result?.error?.message || "Tải tệp lên Cloudinary thất bại.");
    }

    return {
        url: result.secure_url,
        kind: mediaType.kind,
        name: file.name,
        format: result.format || extension,
    };
}
