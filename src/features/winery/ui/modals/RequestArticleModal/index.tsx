import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { FormTextarea } from "../../../../../ui/atoms/FormTextarea";
import { throwErrorToast, throwSuccessToast } from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { CatalogueAPI } from "../../../../utils/api/requests/catalogue-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { getModalSchema } from "../../../../utils/schemas/PromoSchema";

interface RequestArticleModalProps {
    id: string;
}

export const REQUEST_ARTICLE_MODAL = "REQUEST_ARTICLE_MODAL";

export const RequestArticleModal: FC<RequestArticleModalProps> = observer(({ id }) => {
    const {
        register,
        closeModal,
        activeModalId,
        modalCallback
    } = useModal();
    const { t } = useTranslation();
    const form = useForm<{text: string}>({
        mode: "onChange",
        resolver: joiResolver(getModalSchema(t))
    });
    const { handleSubmit, formState, reset } = form;
    useEffect(() => {
        if (activeModalId !== id) {
            reset({
                text: ""
            });
        }
    }, [activeModalId, id, reset]);

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    const { isDirty, isValid } = formState;

    const { mutate, isLoading } = useMutation({
        fetchFn: CatalogueAPI.sendRequest,
        onSuccess: data => {
            closeModal();
            const cb = modalCallback[id];
            cb && cb(true, data);
            throwSuccessToast(t("individualProgramRequestSuccess"))
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });

    const onSubmit = (values: {text: string}) => {
            mutate({
                type: "article",
                text: values.text
            });
    };

    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h4 className="text-18 font-semibold p-6">
                {t(`requestWineryArticle`)}
            </h4>

            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormTextarea
                        name="text"
                        label={t("typeUrReason")}
                        className="mt-26p px-6 mb-50p w-full"
                        textareaClasses="min-h-170p resize-none"
                    />
                    <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                        <Button
                            text={t("send")}
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
