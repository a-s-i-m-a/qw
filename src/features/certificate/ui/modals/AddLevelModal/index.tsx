import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { FormInput } from "../../../../../ui/atoms/FormInput";
import { FormTextarea } from "../../../../../ui/atoms/FormTextarea";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { Level } from "../../../../types";
import { CertificatesAPI } from "../../../../utils/api/requests/certificates-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { getAddLevelSchema } from "../../../../utils/schemas/CertificatesSchema";

interface AddLevelModalProps {
    id: string;
}

export const ADD_LEVEL_MODAL = "ADD_LEVEL_MODAL";

interface LevelPayload {
    name: string;
    sortNumber: number;
    description: string;
}

export const AddLevelModal: FC<AddLevelModalProps> = observer(({ id }) => {
    const {
        register,
        closeModal,
        activeModalId,
        modalData,
        modalCallback
    } = useModal<{
        item?: { level: Level; id: string; defaultNumber: number };
    }>();
    const { t } = useTranslation();
    const form = useForm<LevelPayload>({
        mode: "onChange",
        resolver: joiResolver(getAddLevelSchema(t))
    });
    const { handleSubmit, setValue, formState, reset, watch } = form;
    const name = watch("name");
    const description = watch("description");
    const { isDirty, isValid } = formState;

    useEffect(() => {
        if (activeModalId !== id) {
            reset({
                name: "",
                sortNumber: undefined,
                description: ""
            });
        }
    }, [activeModalId, id, reset, modalData?.item?.defaultNumber]);

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    useEffect(() => {
        if (modalData && modalData.item && modalData.item.level) {
            if (modalData.item.level._id) {
                reset({
                    name: modalData.item.level.name,
                    sortNumber: modalData.item.level.sortNumber + 1,
                    description: modalData.item.level.description
                });
            } else {
                setValue("name", modalData.item?.level.name, {
                    shouldDirty: true,
                    shouldValidate: true
                });
                setValue("sortNumber", modalData.item?.level.sortNumber + 1, {
                    shouldDirty: true,
                    shouldValidate: true
                });
                setValue("description", modalData.item?.level.description, {
                    shouldDirty: true,
                    shouldValidate: true
                });
            }
        } else {
            reset({
                name: "",
                sortNumber: modalData?.item?.defaultNumber,
                description: ""
            });
        }
    }, [modalData, reset, setValue]);

    const { mutate, isLoading } = useMutation({
        fetchFn: modalData?.item?.level?._id
            ? CertificatesAPI.updateLevel
            : CertificatesAPI.createLevel,
        onSuccess: data => {
            closeModal();
            const cb = modalCallback[id];
            cb && cb(true, data);

            modalData?.item?.level?._id
                ? throwSuccessToast(t(`changesSaved`))
                : throwSuccessToast(t(`certificate.levelAdded`));
        },
        onError: e => {
            throwErrorToast(t("error"), t("unknownError"));
        }
    });

    const onSubmit = (values: LevelPayload) => {
        mutate({
            formData: {
                _id: modalData?.item?.level?._id,
                name: values.name,
                sortNumber: values.sortNumber - 1,
                description: values.description,
                certificateId: modalData?.item?.id
            }
        });
    };

    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h4 className="text-18 font-semibold p-6">
                {modalData?.item?.level?._id
                    ? `${t("editing")} ${t(
                          "certificate.level.plural_2"
                      ).toLowerCase()}`
                    : t(`certificate.addLevel`)}
            </h4>
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="px-25p mt-25p">
                        <span className="flex flex-row justify-between mb-30p">
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
                        <FormTextarea
                            className="mb-50p"
                            name="description"
                            label={t("description")}
                            description={`${description.length} / 125`}
                            max={125}
                        />
                    </div>
                    <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                        <Button
                            text={
                                modalData?.item?.level?._id
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
