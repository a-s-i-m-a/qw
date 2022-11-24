import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { useModal } from "../../../../modalpage/hooks";

import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { FormTextarea } from "../../../../../ui/atoms/FormTextarea";
import { useContext } from "react";
import { tasksStore } from "../../../store/TasksStore";
import { FormProvider, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

interface RejectTaskModalProps {
    id: string;
}

export const REJECT_TASK_MODAL = "REJECT_TASK_MODAL";

export const RejectTaskModal: FC<RejectTaskModalProps> = observer(({ id }) => {
    const { t } = useTranslation();
    const { rejectTask } = useContext(tasksStore);
    const { register, closeModal, activeModalId } = useModal();

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    const formMethods = useForm({
        mode: "onChange",
        resolver: joiResolver(
            Joi.object({
                reason: Joi.string()
                    .required()
                    .messages({
                        "any.required": t("fieldIsRequired"),
                        "string.empty": t("fieldIsRequired")
                    })
            })
        )
    });

    const { handleSubmit, formState, reset } = formMethods;
    const { isValid, isDirty } = formState;
    const { mutate, isLoading } = useMutation({
        fetchFn: rejectTask,
        onSuccess: () => {
            throwSuccessToast(t("rejectWasSent"), t("taskWasRejected"));
            closeModal();
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });

    useEffect(() => {
        if (activeModalId !== id) {
            reset();
        }
    }, [activeModalId, id, reset]);
    if (activeModalId !== id) return null;
    const onSubmit = ({ reason }: { reason: string }) => {
        mutate({ reason });
    };
    return (
        <FormProvider {...formMethods}>
            <form
                className="w-600p bg-white rounded-20p flex flex-col text-dark-main"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="text-18 font-semibold p-6">
                    {t("provideRejectReason")}
                </h2>
                <FormTextarea
                    className="mt-25p px-6"
                    name={`reason`}
                    label={t("typeUrReason")}
                    textareaClasses="resize-none h-44"
                />
                <div className="w-full bg-gray-bg mt-16 p-6 flex rounded-b-20p">
                    <Button
                        text={t("send")}
                        isDisabled={!isDirty || !isValid || isLoading}
                    />
                    <Button
                        className="ml-4"
                        text={t("cancel_2")}
                        type="tertiary"
                        htmlType="button"
                        onClick={closeModal}
                    />
                </div>
            </form>
        </FormProvider>
    );
});
