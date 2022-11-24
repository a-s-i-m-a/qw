import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { FormInput } from "../../../../../ui/atoms/FormInput";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { GrapeSort } from "../../../../types";
import { DirectoryAPI } from "../../../../utils/api/requests/directory-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { getGrapeSortSchema } from "../../../../utils/schemas/GrapeSortSchema";

interface DeleteModalProps {
    id: string;
}

export const GRAPESORT_EDIT_MODAL = "GRAPESORT_EDIT_MODAL";

export const GrapeSortModal: FC<DeleteModalProps> = observer(({ id }) => {
    const {
        register,
        closeModal,
        activeModalId,
        modalData,
        modalCallback
    } = useModal<{
        item: GrapeSort;
    }>();
    const { t } = useTranslation();
    const form = useForm<GrapeSort>({
        mode: "onChange",
        resolver: joiResolver(getGrapeSortSchema(t))
    });
    const { handleSubmit, setValue, formState, reset } = form;
    useEffect(() => {
        if (activeModalId !== id) {
            reset({
                name: ""
            });
        }
    }, [activeModalId, id, reset]);
    useEffect(() => {
        if (modalData && modalData.item) {
            if (modalData.item._id) {
                reset({
                    name: modalData.item.name
                });
            } else {
                setValue("name", modalData.item?.name, {
                    shouldDirty: true,
                    shouldValidate: true
                });
            }
        }
    }, [id, modalData, reset, setValue]);
    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    const { isDirty, isValid } = formState;

    const { mutate, isLoading } = useMutation({
        fetchFn: modalData?.item?._id
            ? DirectoryAPI.updateGrapeSort
            : DirectoryAPI.createGrapeSort,
        onSuccess: data => {
            closeModal();
            const cb = modalCallback[id];
            cb && cb(true, data);
            if (modalData?.item?._id) {
                throwSuccessToast(
                    t(`changesSaved`),
                    t(`grapeSort.changesSaved`)
                );
            } else {
                throwSuccessToast(
                    t(`grapeSort.successTitle`),
                    t(`grapeSort.successDescription`)
                );
            }
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });

    const onSubmit = (values: GrapeSort) => {
        mutate({
            name: {
                default: values.name
            },
            _id: modalData?.item?._id || ""
        });
    };

    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h4 className="text-18 font-semibold p-6">
                {modalData?.item?._id
                    ? `${t("editing")} ${t("grapeSort.plural_2").toLowerCase()}`
                    : t(`grapeSort.addTitle`)}
            </h4>

            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormInput
                        label={t("grapeSort.plural_0")}
                        name="name"
                        placeholder={t("grapeSort.plural_0")}
                        className="mt-6 px-6 mb-12 w-full"
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
