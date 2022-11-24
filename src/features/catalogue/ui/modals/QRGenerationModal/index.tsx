import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { FormInput } from "../../../../../ui/atoms/FormInput";
import { throwErrorToast, throwSuccessToast } from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { Product } from "../../../../types";
import { CatalogueAPI } from "../../../../utils/api/requests/catalogue-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { getQRSchema } from "../../../../utils/schemas/QRSchema";

interface QRGenerationModalProps {
    id: string;
}

export const QR_GENERATION_MODAL = "QR_GENERATION_MODAL";

export const QRGenerationModal: FC<QRGenerationModalProps> = observer(
    ({ id }) => {
        const { register, closeModal, activeModalId, modalCallback, modalData } = useModal<{ item: Product }>();
        const { t } = useTranslation();
        const form = useForm({
            mode: "onChange",
            resolver: joiResolver(getQRSchema(t))
        });
        const { reset, handleSubmit } = form;
        const { isDirty, isValid } = form.formState;

        useEffect(() => {
            register({
                id
            });
        }, [id, register]);
        const { mutate } = useMutation({
            fetchFn: CatalogueAPI.generateHashes,
            onSuccess: data => {
                closeModal();
                const cb = modalCallback[QR_GENERATION_MODAL];
                cb && cb(true, data);
                throwSuccessToast(
                    t("qrGenerationSuccess")
                );
            },
            onError: () => throwErrorToast(t("error"), t("unknownError"))
        });
        const onSubmit = (values: {count: number}) => {
            modalData && mutate({
                id: modalData?.item?._id,
                count: values?.count
            })
        };

        useEffect(() => {
            if (activeModalId !== id) {
                reset();
            }
        }, [reset, activeModalId, id]);
        if (activeModalId !== id) return null;

        return (
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
                        <h4 className="text-18 font-semibold p-6">
                            {t("qrGeneration")}
                        </h4>
                        <FormInput
                            name="count"
                            label={t("typeQRCount")}
                            isMaskedNumber={true}
                            decimalScale={0}
                            allowNegative={false}
                            className="mt-6 mb-50p px-6"
                            maxLength={4}
                        />

                        <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                            <Button
                                // onClick={onPrint}
                                htmlType="submit"
                                text={t("print")}
                                isDisabled={
                                    // isLoading ||
                                    !isValid || !isDirty
                                }
                            />
                            <Button
                                text={t("cancel_2")}
                                type="tertiary"
                                className="ml-4"
                                onClick={closeModal}
                            />
                        </div>
                    </section>
                </form>
            </FormProvider>
        );
    }
);
