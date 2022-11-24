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
import { VineStyle } from "../../../../types";
import { DirectoryAPI } from "../../../../utils/api/requests/directory-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { getVineStyleSchema } from "../../../../utils/schemas/getVineStyleSchema";

interface DeleteModalProps {
    id: string;
}

export const WINESTYLE_EDIT_MODAL = "WINESTYLE_EDIT_MODAL";

export const WineStyleModal: FC<DeleteModalProps> = observer(({ id }) => {
    const {
        register,
        closeModal,
        activeModalId,
        modalData,
        modalCallback
    } = useModal<{
        item: VineStyle;
    }>();
    const { t } = useTranslation();
    const form = useForm<VineStyle>({
        mode: "onChange",
        resolver: joiResolver(getVineStyleSchema(t))
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
            ? DirectoryAPI.updateWineStyle
            : DirectoryAPI.createWineStyle,
        onSuccess: data => {
            closeModal();
            const cb = modalCallback[id];
            cb && cb(true, data);
            if (modalData?.item?._id) {
                throwSuccessToast(
                    t(`changesSaved`),
                    t(`wineStyle.changesSaved`)
                );
            } else {
                throwSuccessToast(
                    t(`wineStyle.successTitle`),
                    t(`wineStyle.successDescription`)
                );
            }
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });

    const onSubmit = (values: VineStyle) => {
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
                    ? `${t("editing")} ${t("wineStyle.plural_2").toLowerCase()}`
                    : t(`wineStyle.addTitle`)}
            </h4>

            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormInput
                        name="name"
                        label={t("wineStyle.plural_0")}
                        placeholder={t("wineStyle.plural_0")}
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
