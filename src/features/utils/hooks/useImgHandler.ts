import { useState } from "react";
import { throwErrorToast } from "../../../ui/organisms/Toaster";
import { useTranslation } from "react-i18next";

const maxFileSize = 1024 * 1024 * 5; // 5 Mb

const validateFile = (
    file: File,
    onError: (type: "size" | "extension") => void
) => {
    let isValid = true;

    if (file.size > maxFileSize) {
        isValid = false;
        onError("size");
    }
    if (!file.name.match(/.(jpg|png|jpeg)$/i)) {
        isValid = false;
        onError("extension");
    }
    return isValid;
};

export interface UploaderProps {
    onChange: (event: File) => void;
    minImgDimension: 280 | 140;
    aspectRatio?: 1 | 1.675;
}
export const useImgHandler = ({
    onChange,
    minImgDimension,
    aspectRatio
}: UploaderProps) => {
    const { t } = useTranslation();
    const [isDragActive, setOnDragZone] = useState<boolean>(false);
    const [upImg, setUpImg] = useState<string>();
    const [fileName, setFileName] = useState<string>("");
    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement> | { target: { files: FileList } }
    ) => {
        const validateimageDimensions = (image: HTMLImageElement) => {
            return (
                image?.width > minImgDimension && image?.height > minImgDimension
            );
        };

        const target = e.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        const reader = new FileReader();
        reader.addEventListener("load", () =>
            setUpImg(reader.result as string)
        );
        setFileName(file?.name);
        reader.readAsDataURL(file);

        const fileIsValid = validateFile(file, type => {
            if (type === "size") {
                throwErrorToast(t("error"), t("fileSizeIsToBig"));
            } else {
                throwErrorToast(t("error"), t("checkFileRequirements"));
            }
        });

        if (file && fileIsValid) {
            const image = new Image();

            image.onload = (event: Event) => {
                if (validateimageDimensions(image)) {
                    onChange(file);
                } else {
                    throwErrorToast(t("error"), t("checkFileRequirements"));
                }
            };
            image.onerror = () => {
                throwErrorToast(t("error"), t("unknownError"));
            };
            image.src = URL.createObjectURL(file);
        }
    };
    const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        handleImageChange({ target: { files: e.dataTransfer.files } });
        setOnDragZone(false);

        e.preventDefault();
        e.stopPropagation();
    };
    const onDragEnter = () => setOnDragZone(true);
    const onDragLeave = () => setOnDragZone(false);

    return {
        onDragOver,
        onDragEnter,
        onDragLeave,
        onDrop,
        isDragActive,
        upImg,
        setUpImg,
        fileName,
        setFileName,
        onInputChange: handleImageChange
    };
};
