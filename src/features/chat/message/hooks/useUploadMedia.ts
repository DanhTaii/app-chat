import {useState} from "react";
import {uploadMedia} from "@/features/chat/message/api/mediaUploadApi.ts";
import type {UploadedMedia} from "@/features/chat/message/types.ts";

export function useUploadMedia() {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = async (file: File): Promise<UploadedMedia | null> => {
        setIsUploading(true);
        setError(null);
        try {
            return await uploadMedia(file);
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : "Lỗi khi tải tệp lên.");
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return {uploadFile, isUploading, error};
}
