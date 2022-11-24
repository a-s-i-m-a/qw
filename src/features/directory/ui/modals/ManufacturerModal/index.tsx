import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { FormInput } from "../../../../../ui/atoms/FormInput";
import { ManufacturePlaceholder } from "../../../../../ui/atoms/illustration";
import { ImageUpload } from "../../../../../ui/atoms/ImageUpload";
import { OptionType } from "../../../../../ui/atoms/Select";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { FetchSelect } from "../../../../catalogue/ui/molecules/FetchSelect";
import { getSafariFriendlyDate } from "../../../../catalogue/utils/getSafariFriendlyDate";
import { useModal } from "../../../../modalpage/hooks";
import { FileType, Manufacturer } from "../../../../types";
import { DirectoryAPI } from "../../../../utils/api/requests/directory-requests";
import { uploadFile } from "../../../../utils/api/requests/file-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { getManufacturerSchema } from "../../../../utils/schemas/ManufacturerSchema";
import { ArticleSelect } from "../../molecules/ArticleSelect";

interface DeleteModalProps {
    id: string;
}

export const MANUFACTURER_EDIT_MODAL = "MANUFACTURER_EDIT_MODAL";

interface ManufacturerPayload {
    name: string;
    country: OptionType;
    logoId: string | null;
    logo: FileType | File | null;
    articles: OptionType;
}
export const ManufacturerModal: FC<DeleteModalProps> = observer(({ id }) => {
    const {
        register,
        closeModal,
        activeModalId,
        modalData,
        modalCallback,
        getModalById
    } = useModal<{
        item?: Manufacturer;
    }>();
    const { t } = useTranslation();
    const form = useForm<ManufacturerPayload>({
        mode: "onChange",
        resolver: joiResolver(getManufacturerSchema(t))
    });
    const { handleSubmit, setValue, formState, reset } = form;
    useEffect(() => {
        if (activeModalId !== id) {
            reset({
                name: "",
                country: undefined,
                articles: undefined
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

    const { isDirty, isValid } = formState;

    useEffect(() => {
        if (modalData && modalData.item) {
            if (modalData.item._id) {
                reset({
                    logo: modalData.item?.logo,
                    logoId: modalData.item?.logoId,
                    name: modalData.item.name,
                    ...(modalData.item.country
                        ? {
                              country: {
                                  label: modalData.item.country.name,
                                  value: modalData.item.country._id
                              }
                          }
                        : {}),
                    ...(modalData.item.article
                        ? {
                              articles: {
                                  label: `${modalData.item.name} 
                                    (${getSafariFriendlyDate(
                                        modalData.item.article.createDate
                                    ).format("DD.MM.YYYY")})`,
                                  value: modalData.item.article._id
                              }
                          }
                        : {})
                });
            } else {
                setValue("name", modalData.item?.name, {
                    shouldDirty: true,
                    shouldValidate: true
                });
                modalData.item.country &&
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
            ? DirectoryAPI.updateManufacturer
            : DirectoryAPI.createManufacturer,
        onSuccess: data => {
            closeModal();
            const cb = modalCallback[id];
            cb && cb(true, data);
            if (modalData?.item?._id) {
                throwSuccessToast(
                    t(`changesSaved`),
                    t(`manufacturer.changesSaved`)
                );
            } else {
                throwSuccessToast(
                    t(`manufacturer.successTitle`),
                    t(`manufacturer.successDescription`)
                );
            }
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });

    const onSubmit = async (values: ManufacturerPayload) => {
        let logoId = values.logoId || null;

        if (values?.logo instanceof File) {
            const { _id } = await uploadFile(values?.logo);
            logoId = _id;
        }
        mutate({
            countryId: values.country.value,
            articleId: values?.articles?.value,
            name: {
                default: values.name
            },
            _id: modalData?.item?._id ?? undefined,
            logoId: logoId ?? modalData?.item?.logo?._id
        });
    };

    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h4 className="text-18 font-semibold p-6">
                {modalData?.item?._id
                    ? `${t("editing")} ${t("manufacturer.plural_2").toLowerCase()}`
                    : t(`manufacturer.addTitle`)}
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
                        label={t("manufacturer.plural_0")}
                        placeholder={t("manufacturer.enterName")}
                        className="mt-8 px-6 mb-12 w-full"
                    />
                    <ArticleSelect
                        disabled={!!modalData?.item?._id}
                        label={t("manufacturerArticle")}
                        id={modalData?.item?._id}
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
