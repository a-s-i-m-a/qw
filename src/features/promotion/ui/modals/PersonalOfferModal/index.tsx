import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { FormTextarea } from "../../../../../ui/atoms/FormTextarea";
import { throwErrorToast, throwSuccessToast } from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { CatalogueAPI } from "../../../../utils/api/requests/catalogue-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { getModalSchema } from "../../../../utils/schemas/PromoSchema";

interface PersonalOfferModalProps {
    id: string;
}

export const PERSONAL_OFFER_REQUEST = "PERSONAL_OFFER_REQUEST";

export const PersonalOfferModal: FC<PersonalOfferModalProps> = observer(
    ({ id }) => {
        const { register, activeModalId, closeModal } = useModal();
        const { t } = useTranslation();
        
        
        useEffect(() => {
            register({
                id
            });
        }, [id, register]);
        
        const formMethods = useForm<{text: string}>({
            mode: "onChange",
            resolver: joiResolver(getModalSchema(t))
            });
        const { handleSubmit, formState, reset } = formMethods;
        
        useEffect(() => {
            if (activeModalId !== id) {
                reset({
                    text: ""
                });
            }
        }, [activeModalId, id, reset]);

        const { isValid, isDirty } = formState;
        const { mutate, isLoading } = useMutation({
            fetchFn: CatalogueAPI.sendRequest,
            onSuccess: () => {
                throwSuccessToast(t("individualProgramRequestSuccess"));
                closeModal();
            },
            onError: () => throwErrorToast(t("error"), t("unknownError"))
        });

        if (activeModalId !== id) return null;
        const onSubmit = (values: {text: string}) => {
            mutate({
                type: "promo",
                text: values?.text
            })
        };
        return (
            <FormProvider {...formMethods}>
                <form
                    className="w-600p bg-white rounded-20p flex flex-col text-dark-main"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h4 className="text-18 font-semibold p-6">
                        {t(`requestPersonalOffer`)}
                    </h4>
                    <FormTextarea
                        className="mt-25p px-6 mb-50p"
                        name={`text`}
                        label={t("typeUrReason")}
                        textareaClasses="resize-none min-h-170p"
                    />

                    <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                        <Button
                            htmlType="submit"
                            text={t("send")}
                            isDisabled={
                                !isDirty || !isValid || isLoading
                            }
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
        );
    }
);
