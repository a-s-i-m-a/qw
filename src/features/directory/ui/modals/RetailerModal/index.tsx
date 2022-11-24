import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { FormInput } from "../../../../../ui/atoms/FormInput";
import { ManufacturePlaceholder } from "../../../../../ui/atoms/illustration";
import { ImageUpload } from "../../../../../ui/atoms/ImageUpload";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { FileType, Retailer } from "../../../../types";
import { DirectoryAPI } from "../../../../utils/api/requests/directory-requests";
import { uploadFile } from "../../../../utils/api/requests/file-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { getRetailerSchema } from "../../../../utils/schemas/RetailerSchema";

interface ModalProps {
    id: string;
}

export const RETAILER_EDIT_MODAL = "RETAILER_EDIT_MODAL";

interface RetailerPayload {
    name: string;
    logoId: string | null;
    logo: FileType | File | null;
}
export const RetailerModal: FC<ModalProps> = observer(({ id }) => {
    const {
        register,
        closeModal,
        activeModalId,
        modalData,
        modalCallback,
        getModalById
    } = useModal<{
        item?: Retailer;
    }>();
    const { t } = useTranslation();
    const form = useForm<RetailerPayload>({
        mode: "onChange",
        resolver: joiResolver(getRetailerSchema(t))
    });
    const { handleSubmit, setValue, formState, reset } = form;
    const { isDirty, isValid } = formState;

    useEffect(() => {
        if (activeModalId !== id) {
            reset({
                name: ""
            });
        }
    }, [activeModalId, id, reset]);

    useEffect(() => {
        if (modalData && modalData.item) {
            reset({
                name: modalData.item.name
            });
        }
    }, [getModalById, id, modalData, reset, setValue]);

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    useEffect(() => {
        if (modalData && modalData.item) {
            if (modalData.item._id) {
                reset({
                    logo: modalData.item?.logo,
                    logoId: modalData.item?.logoId,
                    name: modalData.item.name
                });
            } else {
                setValue("name", modalData.item?.name, {
                    shouldDirty: true,
                    shouldValidate: true
                });
            }
        }
    }, [modalData, reset, setValue]);
    const { mutate, isLoading } = useMutation({
        fetchFn: modalData?.item?._id
            ? DirectoryAPI.updateRetailer
            : DirectoryAPI.createRetailer,
        onSuccess: data => {
            closeModal();
            const cb = modalCallback[id];
            cb && cb(true, data);
            if (modalData?.item?._id) {
                throwSuccessToast(
                    t(`changesSaved`),
                    t(`retailer.changesSaved`)
                );
            } else {
                throwSuccessToast(
                    t(`retailer.successTitle`),
                    t(`retailer.successDescription`)
                );
            }
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });

    const onSubmit = async (values: RetailerPayload) => {
        let logoId = values.logoId || null;

        if (values?.logo instanceof File) {
            const { _id } = await uploadFile(values?.logo);
            logoId = _id;
        }
        mutate({
            name: values.name,
            _id: modalData?.item?._id || "",
            logoId: modalData?.item?.logo?._id || logoId
        });
    };

    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h4 className="text-18 font-semibold p-6">
                {modalData?.item?._id
                    ? `${t("editing")} ${t("retailer.plural_2").toLowerCase()}`
                    : t(`retailer.addTitle`)}
            </h4>
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ImageUpload
                        EmptyState={ManufacturePlaceholder}
                        name="logo"
                        objectFit="cover"
                        alt={modalData?.item?.name}
                        className="px-25p mt-25p"
                    />
                    <FormInput
                        name="name"
                        label={t("retailer.plural_0")}
                        placeholder={t("retailer.enterName")}
                        className="mt-8 px-6 mb-12 w-full"
                    />
                    <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                        <Button
                            text={
                                modalData?.item?._id ? t("save") : t("create")
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
