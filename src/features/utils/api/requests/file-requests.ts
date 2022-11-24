import { post } from "../axiosConfig";

export const uploadFile = async (
    file: File,
    onUploadProgress?: any
): Promise<{ _id: string; url: string }> => {
    const formData = new FormData();
    formData.set("file", file);
    const handleUploadProgress = (progressEvent: any) => {
        const progressPercent = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
        );
        onUploadProgress(progressPercent);
    };

    // TODO Add types and cancel token

    const { data } = await post("/api/v1/files/upload", formData, {
        onUploadProgress: onUploadProgress ? handleUploadProgress : undefined
    });
    return data.result;
};
