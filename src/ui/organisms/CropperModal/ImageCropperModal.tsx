import { observer } from "mobx-react-lite";
import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../atoms/Button";
import { Cropper } from "react-cropper";
import "./cropper.css";
import { useModal } from "../../../features/modalpage/hooks";
import { CloseSmIcon } from "../../atoms/Icon";
import { FormProvider, useForm } from "react-hook-form";
import {
    UploaderProps,
    useImgHandler
} from "../../../features/utils/hooks/useImgHandler";
import { RangeInput } from "../../atoms/RangeInput";

interface ImageCropperModalProps {
    id: string;
}

interface CropperModalData {
    name: string;
    value: File;
    onChange: (file: File) => void;
    aspectRatio: UploaderProps["aspectRatio"];
}

export const IMAGE_CROPPER_MODAL = "IMAGE_CROPPER_MODAL";

export const ImageCropperModal: FC<ImageCropperModalProps> = observer(
    ({ id }) => {
        const { t } = useTranslation();
        const { register, activeModalId, closeModal, modalData } = useModal<{
            data: CropperModalData;
        }>();

        const form = useForm({
            mode: "onChange"
        });
        const { handleSubmit, setValue, watch } = form;
        const ref = useRef<HTMLImageElement>(null);

        const value = watch(modalData?.data?.name || "");
        const [zoom, setZoom] = useState<number>(0.5);
        const [minZoom, setMinZoom] = useState<number>(0.15);
        const [cropper, setCropper] = useState<Cropper>();

        const onChange = (value: any) => {
            modalData && setValue(modalData?.data?.name, value);
        };
        const {
            onDragEnter,
            onDragOver,
            onDragLeave,
            onDrop,
            onInputChange,
            upImg,
            fileName
        } = useImgHandler({
            onChange,
            minImgDimension: 280
        });

        useEffect(() => {
            register({
                id
            });
        }, [id, register]);

        useEffect(() => {
            if (cropper) {
                modalData?.data?.aspectRatio === 1
                    ? cropper.setCropBoxData({ height: 260, left: 146 })
                    : cropper.setCropBoxData({ height: 260, left: 59 });
                if (ref?.current) {
                    const imageHeight = ref?.current?.height;
                    const imageWidth = ref?.current?.width;
                    const imageAspectRatio = imageWidth / imageHeight;

                    if (imageHeight < imageWidth) {
                        if (modalData?.data?.aspectRatio === 1) {
                            const zoom = 260 / (imageWidth / 100) / 100;
                            zoom < 0.15 ? setMinZoom(zoom) : setMinZoom(0.15);
                            setZoom(zoom);
                        } else if (imageAspectRatio > 1.675) {
                            const zoom = 435 / (imageWidth / 100) / 100;
                            zoom < 0.15 ? setMinZoom(zoom) : setMinZoom(0.15);
                            setZoom(zoom);
                        } else {
                            const zoom = 260 / (imageHeight / 100) / 100;
                            zoom < 0.15 ? setMinZoom(zoom) : setMinZoom(0.15);
                            setZoom(zoom);
                        }
                    } else {
                        const zoom = 260 / (imageHeight / 100) / 100;
                        zoom < 0.15 ? setMinZoom(zoom) : setMinZoom(0.15);
                        setZoom(zoom);
                    }
                }
            }
        }, [cropper, modalData?.data?.aspectRatio]);

        const onZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setZoom(Number(e.target.value));
            cropper && cropper.zoomTo(Number(e.target.value));
        };

        const onMinusClick = () => {
            setZoom(prev => {
                if (prev && prev >= minZoom + 0.1) {
                    return prev - 0.1;
                }
                return 0.15;
            });
            if (cropper && zoom >= minZoom + 0.1) {
                cropper.zoomTo(zoom - 0.1);
            } else {
                cropper && cropper.zoomTo(minZoom);
            }
        };

        const onPlusClick = () => {
            setZoom(prev => {
                if (prev && prev <= 1.9) {
                    return prev + 0.1;
                }
                return 2;
            });
            if (cropper && zoom <= 1.9) {
                cropper.zoomTo(zoom + 0.1);
            } else {
                cropper && cropper.zoomTo(2);
            }
        };

        const onRemove = () => {
            setZoom(0.5);
            modalData && setValue(modalData?.data?.name, undefined);
        };

        const onSubmit = () => {
            cropper?.getCroppedCanvas().toBlob(blob => {
                if (blob) {
                    const file = new File([blob], fileName, {
                        type: blob.type
                    });
                    modalData?.data?.onChange(file);
                }
            });
            modalData && setValue(modalData?.data?.name, undefined);
            setZoom(0.5);
            closeModal();
        };

        const onClose = () => {
            closeModal();
            setZoom(0.5);
            modalData && setValue(modalData?.data?.name, undefined);
        };

        const Uploader = (
            <div className="grid justify-items-center m-auto space-y-30p w-full h-260p p-40p rounded-20p bg-dashed-bdr">
                <div className="w-210p text-gray-text text-center text-base">
                    {t("articles.imgInstruction")}
                </div>
                <label
                    className={`mt-auto cursor-pointer`}
                    htmlFor={modalData?.data?.name}
                >
                    <Button
                        htmlType="button"
                        className="pointer-events-none"
                        text={t("articles.loadFromMyDoc")}
                    />
                </label>
                <div className="w-390p text-gray-text text-center text-14 mt-16p">
                    {t("imageUploadDescr", {
                        value: `${modalData?.data?.aspectRatio}:1`
                    })}
                </div>
            </div>
        );

        if (activeModalId !== id) return null;

        return (
            <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main pt-6">
                <h4 className="text-18 font-semibold px-6 mb-25p">
                    {t(`changingPhoto`)}
                </h4>
                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mx-6">
                            {value instanceof File ? (
                                <div className="h-260p border-0 rounded-20p flex items-center overflow-hidden">
                                    <Cropper
                                        className="h-260p w-full"
                                        ref={ref}
                                        src={upImg}
                                        viewMode={0}
                                        zoomTo={zoom}
                                        guides={false}
                                        center={false}
                                        background={false}
                                        zoomOnWheel={false}
                                        minCropBoxWidth={160}
                                        minCropBoxHeight={160}
                                        aspectRatio={
                                            modalData?.data?.aspectRatio || 1
                                        }
                                        initialAspectRatio={
                                            modalData?.data?.aspectRatio || 1
                                        }
                                        onInitialized={instance =>
                                            setCropper(instance)
                                        }
                                    />
                                </div>
                            ) : (
                                <>
                                    <label
                                        onDragEnter={onDragEnter}
                                        onDragLeave={onDragLeave}
                                        onDragOver={onDragOver}
                                        onDrop={onDrop}
                                        className="cursor-pointer"
                                        htmlFor={modalData?.data?.name}
                                    >
                                        <div className="relative upload">
                                            {Uploader}
                                        </div>
                                    </label>
                                    <input
                                        onChange={onInputChange}
                                        name={modalData?.data?.name}
                                        id={modalData?.data?.name}
                                        type="file"
                                        hidden={true}
                                        accept="image/*"
                                    />
                                </>
                            )}
                        </div>
                        <span
                            className={`flex flex-row items-center ${
                                value instanceof File
                                    ? "justify-between"
                                    : "justify-end"
                            } px-6`}
                        >
                            {value instanceof File && (
                                <span className="flex flex-row items-center max-w-335p">
                                    <p className="text-16 text-dark-main mr-10p max-w-300p truncate">
                                        {fileName}
                                    </p>
                                    <button
                                        className="w-22p h-22p rounded-full bg-purple-main flex items-center justify-center focus:outline-none"
                                        type="button"
                                        onClick={onRemove}
                                    >
                                        <CloseSmIcon />
                                    </button>
                                </span>
                            )}
                            <RangeInput
                                min={minZoom}
                                max={2}
                                step={0.01}
                                value={zoom}
                                onChange={onZoomChange}
                                disabled={!(value instanceof File)}
                                onMinusClick={onMinusClick}
                                onPlusClick={onPlusClick}
                            />
                        </span>
                        <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                            <Button
                                htmlType="submit"
                                isDisabled={!(value instanceof File)}
                                text={t("save")}
                            />
                            <Button
                                text={t("cancel_2")}
                                type="tertiary"
                                className="ml-4"
                                onClick={onClose}
                            />
                        </div>
                    </form>
                </FormProvider>
            </section>
        );
    }
);
