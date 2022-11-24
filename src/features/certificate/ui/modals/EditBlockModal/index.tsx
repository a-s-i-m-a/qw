import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { FormInput } from "../../../../../ui/atoms/FormInput";
import { WinePlaceholder } from "../../../../../ui/atoms/illustration";
import { ImageUpload } from "../../../../../ui/atoms/ImageUpload";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { FileType, LessonBlock } from "../../../../types";
import { CertificatesAPI } from "../../../../utils/api/requests/certificates-requests";
import { uploadFile } from "../../../../utils/api/requests/file-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { getEditBlockSchema } from "../../../../utils/schemas/CertificatesSchema";

interface ModalProps {
    id: string;
}

export const BLOCK_EDIT_MODAL = "BLOCK_EDIT_MODAL";

interface BlockPayload {
    name: string;
    sortNumber: number;
    imageId?: string | null;
    image?: FileType | File | null;
}
export const BlockModal: FC<ModalProps> = observer(({ id }) => {
    const {
        register,
        closeModal,
        activeModalId,
        modalData,
        modalCallback
    } = useModal<{
        item?: { block: LessonBlock; id: string; defaultNumber: number };
    }>();
    const { t } = useTranslation();
    const form = useForm<BlockPayload>({
        mode: "onChange",
        resolver: joiResolver(getEditBlockSchema(t))
    });
    const { handleSubmit, setValue, formState, reset, watch } = form;
    const name = watch("name");
    const { isDirty, isValid } = formState;
    useEffect(() => {
        if (activeModalId !== id) {
            reset({
                name: "",
                sortNumber: undefined
            });
        } else {
            reset({
                name: "",
                sortNumber: modalData?.item?.defaultNumber
            });
        }
    }, [activeModalId, id, reset, modalData]);

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    useEffect(() => {
        if (modalData && modalData.item && modalData?.item?.block) {
            if (modalData?.item?.block?._id) {
                reset({
                    image: modalData?.item?.block?.image,
                    imageId: modalData?.item?.block?.imageId,
                    name: modalData?.item?.block?.name,
                    sortNumber: modalData?.item?.block?.sortNumber + 1
                });
            } else {
                setValue("name", modalData?.item?.block?.name, {
                    shouldDirty: true,
                    shouldValidate: true
                });
                setValue("sortNumber", modalData?.item?.block?.sortNumber, {
                    shouldDirty: true,
                    shouldValidate: true
                });
            }
        }
    }, [modalData, reset, setValue]);
    const { mutate, isLoading } = useMutation({
        fetchFn: modalData?.item?.block?._id
            ? CertificatesAPI.updateBlock
            : CertificatesAPI.createBlock,
        onSuccess: data => {
            closeModal();
            const cb = modalCallback[id];
            cb && cb(true, data);
            if (modalData?.item?.block?._id) {
                throwSuccessToast(t(`changesSaved`));
            } else {
                throwSuccessToast(t(`certificate.blockAdded`));
            }
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });

    const onSubmit = async (values: BlockPayload) => {
        let imageId = values.imageId || undefined;

        if (values?.image instanceof File) {
            const { _id } = await uploadFile(values?.image);
            imageId = _id;
        }
        mutate({
            formData: {
                name: values.name,
                _id: modalData?.item?.block?._id || "",
                sortNumber: values.sortNumber - 1,
                imageId: modalData?.item?.block?.imageId || imageId,
                certificateLevelId: modalData?.item?.id
            }
        });
    };

    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h4 className="text-18 font-semibold p-6">
                {modalData?.item?.block?._id
                    ? `${t("editing")} ${t(
                          "certificate.blocks.plural_2"
                      ).toLowerCase()}`
                    : t(`certificate.addBlock`)}
            </h4>
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ImageUpload
                        EmptyState={WinePlaceholder}
                        name="image"
                        objectFit="cover"
                        alt={modalData?.item?.block?.name}
                        className="px-25p mt-25p"
                        aspectRatio={1.675}
                    />
                    <span className="flex flex-row justify-between mb-30p mx-25p">
                        <FormInput
                            className="w-374p"
                            name="name"
                            label={t("label")}
                            description={`${name.length} / 50`}
                            max={50}
                        />
                        <FormInput
                            className="w-150p"
                            name="sortNumber"
                            label={t("certificate.serialNumber")}
                        />
                    </span>
                    <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                        <Button
                            text={
                                modalData?.item?.block?._id
                                    ? t("save")
                                    : t("create")
                            }
                            isDisabled={!isValid || !isDirty || isLoading}
                        />
                        <Button
                            text={t("cancel_2")}
                            type="tertiary"
                            className="ml-4"
                            htmlType="button"
                            onClick={closeModal}
                        />
                    </div>
                </form>
            </FormProvider>
        </section>
    );
});
