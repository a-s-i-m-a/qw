import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { FormInput } from "../../../../../ui/atoms/FormInput";
import { OptionType } from "../../../../../ui/atoms/Select";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { FetchSelect } from "../../../../catalogue/ui/molecules/FetchSelect";
import { useModal } from "../../../../modalpage/hooks";
import { Region } from "../../../../types";
import { DirectoryAPI } from "../../../../utils/api/requests/directory-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { getRegionSchema } from "../../../../utils/schemas/getRegionSchema";

interface DeleteModalProps {
    id: string;
}

export const REGION_EDIT_MODAL = "REGION_EDIT_MODAL";

interface FormatedRegion {
    name: string;
    country: OptionType;
}

export const RegionModal: FC<DeleteModalProps> = observer(({ id }) => {
    const {
        register,
        closeModal,
        activeModalId,
        modalData,
        modalCallback
    } = useModal<{
        item?: Region;
    }>();
    const { t } = useTranslation();
    const form = useForm<FormatedRegion>({
        mode: "onChange",
        resolver: joiResolver(getRegionSchema(t))
    });
    const { handleSubmit, setValue, formState, reset } = form;
    useEffect(() => {
        if (activeModalId !== id) {
            reset({
                name: "",
                country: undefined
            });
        }
    }, [activeModalId, id, reset]);

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    const { isDirty, isValid } = formState;

    useEffect(() => {
        if (modalData && modalData.item) {
            if (modalData.item._id) {
                reset({
                    name: modalData.item.name,
                    country: {
                        label: modalData.item.country?.name,
                        value: modalData.item.country?._id
                    }
                });
            } else {
                setValue("name", modalData.item?.name, {
                    shouldDirty: true,
                    shouldValidate: true
                });
                setValue(
                    "country",
                    {
                        label: modalData.item.country?.name,
                        value: modalData.item.country?._id
                    },
                    {
                        shouldDirty: true,
                        shouldValidate: true
                    }
                );
            }
        }
    }, [modalData, reset, setValue]);

    const { mutate, isLoading } = useMutation({
        fetchFn: modalData?.item?._id
            ? DirectoryAPI.updateRegion
            : DirectoryAPI.createRegion,
        onSuccess: data => {
            closeModal();
            const cb = modalCallback[id];
            cb && cb(true, data);

            if (modalData?.item?._id) {
                throwSuccessToast(t(`changesSaved`), t(`region.changesSaved`));
            } else {
                throwSuccessToast(
                    t(`region.successTitle`),
                    t(`region.successDescription`)
                );
            }
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });

    const onSubmit = (values: FormatedRegion) => {
        mutate({
            countryId: values.country.value,
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
                    ? `${t("editing")} ${t("region.plural_2").toLowerCase()}`
                    : t(`region.addTitle`)}
            </h4>
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FetchSelect
                        fetchFn={DirectoryAPI.getCountries}
                        placeholder={t("chooseCountry")}
                        name="country"
                        label={t("country")}
                        isSearchable={true}
                        className="px-6 mt-6"
                    />

                    <FormInput
                        name="name"
                        label={t("region.plural_0")}
                        placeholder={t("region.plural_0")}
                        className="mt-8 px-6 mb-12 w-full"
                    />
                    <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                        <Button
                            text={modalData?.item ? t("save") : t("create")}
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
