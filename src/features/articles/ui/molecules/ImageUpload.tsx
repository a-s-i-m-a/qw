import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../ui/atoms/Button";
import {
    UploaderProps,
    useImgHandler
} from "../../../utils/hooks/useImgHandler";
import { useController, useFormContext } from "react-hook-form";
import cn from "classnames";
import CameraIcon from "../../../../assets/svg/camera-icon.svg";
export interface ImageUploadProps {
    isDisabled?: boolean;
    objectFit?: "cover" | "contain";
    name: string;
    alt?: string | undefined;
    className?: string;
    minImgDimension?: UploaderProps["minImgDimension"];
    viewOnly?: boolean;
}

export const ImageUpload: FC<ImageUploadProps> = ({
    isDisabled,
    objectFit = "cover",
    name,
    alt,
    className,
    minImgDimension = 140,
    viewOnly = false
}) => {
    const { t } = useTranslation();
    const context = useFormContext();
    if (!context) {
        throw new Error("Provide FormContext before ImageUpload");
    }
    const { control } = context;
    const {
        field: { value, onChange },
        fieldState: { error }
    } = useController({
        name,
        control
    });

    const {
        onDragEnter,
        onDragOver,
        onDragLeave,
        onDrop,
        isDragActive,
        onInputChange
    } = useImgHandler({
        onChange,
        minImgDimension
    });

    const uploadCn = cn(
        "grid justify-items-center m-auto space-y-30p w-full p-40p rounded-20p bg-dashed-bdr",
        "",
        {
            "bg-dashed-bdr-danger": !!error
        },
        className
    );

    const Img = (
        <>
            {value ? (
                <img
                    className={`w-full h-260p rounded-20p object-cover`}
                    src={
                        value instanceof File
                            ? URL.createObjectURL(value)
                            : `${process.env.REACT_APP_STATIC_URL}${value}`
                    }
                    alt={alt}
                />
            ) : viewOnly ? (
                <span className="font-normal text-base text-dark-main">—</span>
            ) : (
                <div className={uploadCn}>
                    <div className="w-210p text-gray-text text-center text-base">
                        {t("articles.imgInstruction")}
                    </div>
                    <label
                        className={`mt-auto ${
                            isDisabled ? "" : "cursor-pointer"
                        }`}
                        htmlFor={name}
                    >
                        <Button
                            isDisabled={isDisabled}
                            htmlType="button"
                            className="pointer-events-none"
                            text={t("articles.loadFromMyDoc")}
                        />
                    </label>
                    <div className="text-gray-text text-14 mt-16p">
                        {t("articles.imgFormatAndSize")}
                    </div>
                </div>
            )}
        </>
    );

    const wrapperClasses = cn("w-full", {
        "h-260p": value && !viewOnly
    });

    return (
        <div className={wrapperClasses}>
            {isDisabled ? (
                Img
            ) : (
                <label
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    className="cursor-pointer"
                    htmlFor={name}
                >
                    <div className="relative upload">
                        {Img}
                        {value && (
                            <div
                                className={`rounded-20p absolute top-0 w-full h-full flex transition-opacity items-center justify-center upload-placeholder bg-overlay-main-dark ${
                                    isDragActive ? "opacity-100" : "opacity-0"
                                }`}
                                style={{
                                    backgroundImage: `url(${CameraIcon})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center"
                                }}
                            />
                        )}
                    </div>
                </label>
            )}

            {!isDisabled && (
                <input
                    onChange={onInputChange}
                    name={name}
                    id={name}
                    type="file"
                    hidden={true}
                    accept="image/*"
                />
            )}
        </div>
    );
};
