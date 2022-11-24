import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { FetchSelect } from "../../../../catalogue/ui/molecules/FetchSelect";
import { useModal } from "../../../../modalpage/hooks";
import { Certificate } from "../../../../types";
import { CertificatesAPI } from "../../../../utils/api/requests/certificates-requests";
import { DirectoryAPI } from "../../../../utils/api/requests/directory-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { getAddCertificateSchema } from "../../../../utils/schemas/CertificatesSchema";

interface AddCertificateModalProps {
    id: string;
}

export const ADD_CERTIFICATE_MODAL = "ADD_CERTIFICATE_MODAL";

export const AddCertificateModal: FC<AddCertificateModalProps> = observer(
    ({ id }) => {
        const {
            register,
            closeModal,
            activeModalId,
            modalData,
            modalCallback
        } = useModal<{
            item?: Certificate;
        }>();
        const { t, i18n } = useTranslation();
        const form = useForm<Partial<Certificate<false>>>({
            mode: "onChange",
            resolver: joiResolver(getAddCertificateSchema(t))
        });
        const { handleSubmit, setValue, formState, reset } = form;
        useEffect(() => {
            if (activeModalId !== id) {
                reset({
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
                        country: {
                            label: modalData.item.country?.name,
                            value: modalData.item.country?._id
                        }
                    });
                } else {
                    setValue(
                        "country",
                        {
                            label: modalData?.item?.country?.name,
                            value: modalData.item.country?._id
                        },
                        {
                            shouldDirty: true,
                            shouldValidate: true
                        }
                    );
                }
            }
        }, [modalData, reset, setValue, i18n.language]);

        const { mutate, isLoading } = useMutation({
            fetchFn: CertificatesAPI.createCertificate,
            onSuccess: data => {
                closeModal();
                const cb = modalCallback[id];
                cb && cb(true, data);

                throwSuccessToast(t(`certificate.certificateAdded`));
            },
            onError: e => {
                if (e.name === "Error") {
                    throwErrorToast(
                        t("error"),
                        t("certificate.errorDescription")
                    );
                } else {
                    throwErrorToast(t("error"), t("unknownError"));
                }
            }
        });

        const onSubmit = (values: Certificate<false>) => {
            mutate({
                formData: {
                    countryId: values.country.value
                }
            });
        };

        if (activeModalId !== id) return null;

        return (
            <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
                <h4 className="text-18 font-semibold p-6">
                    {t(`certificate.addCertificate`)}
                </h4>
                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FetchSelect
                            fetchFn={DirectoryAPI.getCountries}
                            placeholder={t("chooseCountry")}
                            name="country"
                            label={t("country")}
                            isSearchable={true}
                            className="px-6 mt-6 mb-50p"
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
    }
);
