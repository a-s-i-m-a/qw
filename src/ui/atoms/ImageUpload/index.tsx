import React, { FC, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import { UploaderProps } from "../../../features/utils/hooks/useImgHandler";
import { useController, useFormContext, useWatch } from "react-hook-form";
import cn from "classnames";
import { modalPageStore } from "../../../features/modalpage/store/ModalPageStore";
import { IMAGE_CROPPER_MODAL } from "../../organisms/CropperModal/ImageCropperModal";
interface ImageUploadProps {
    EmptyState: React.ElementType;
    isDisabled?: boolean;
    objectFit?: "cover" | "contain";
    name: string;
    alt: string | undefined;
    className?: string;
    minImgDimension?: UploaderProps["minImgDimension"];
    aspectRatio?: UploaderProps["aspectRatio"];
}

export const ImageUpload: FC<ImageUploadProps> = ({
    isDisabled,
    objectFit = "cover",
    EmptyState,
    name,
    alt,
    className,
    minImgDimension = 140,
    aspectRatio = 1
}) => {
    const { t } = useTranslation();
    const context = useFormContext();
    if (!context) {
        throw new Error("Provide FormContext before ImageUpload");
    }
    const { control } = context;
    const {
        field: { value, onChange }
    } = useController({
        name,
        control
    });
    const [error, setError] = useState(false);
    const file = useWatch({ name });
    const { openModal } = useContext(modalPageStore);

    const onLoad = () => {
        setError(false)
    };

    const onError = () => {
        setError(true)
    };

    const onImageChange = () => {
        openModal(IMAGE_CROPPER_MODAL, {
            data: {
                name,
                onChange,
                value,
                aspectRatio
            }
        });
    };

    useEffect(() => {
        if ( file !== value) {
            setError(false)
            onChange(file);
        }
    }, [file, onChange, value]);

    const Img = (
        <>
            {value && !error ? (
                <img
                    className={`${
                        aspectRatio === 1 ? "w-144p" : "w-238p"
                    } h-144p rounded-20p object-cover`}
                    src={
                        value instanceof File
                            ? URL.createObjectURL(value)
                            : value.url
                    }
                    alt={alt}
                    onLoad={onLoad}
                    onError={onError}
                />
            ) : (
                <EmptyState
                    className={`${
                        aspectRatio === 1 ? "w-144p" : "w-238p"
                    } h-144p rounded-20p border-gray-bg border-2`}
                />
            )}
        </>
    );

    const wrapperClasses = cn("flex mb-50p flex-shrink-0", className);

    return (
        <div className={wrapperClasses}>
            {Img}
            {!isDisabled && (
                <div className="ml-40p flex flex-col text-14 text-gray-text">
                    <div>{t("availableFormats")}</div>
                    <div>{t("aspectRatio", { value: `${aspectRatio}:1` })}</div>
                    <div>{t("maxFileSize")}</div>
                    <label
                        className={`mt-auto ${
                            isDisabled ? "" : "cursor-pointer"
                        }`}
                    >
                        <Button
                            isDisabled={isDisabled}
                            htmlType="button"
                            className="pointer-events-none"
                            text={t("changeTo")}
                            onClick={onImageChange}
                        />
                    </label>
                </div>
            )}
        </div>
    );
};
