import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";

import { useModal } from "../../../../modalpage/hooks";
import { useMutation } from "../../../../utils/hooks/useMutation";

import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { ExpertTask } from "../../../../types";
import { PromosAPI } from "../../../../utils/api/requests/promos-requests";

interface DeleteModalProps {
    id: string;
}

export const DELETE_TASK_MODAL = "DELETE_TASK_MODAL";

export const DeleteTask: FC<DeleteModalProps> = observer(({ id }) => {
    const { t } = useTranslation();

    const {
        register,
        closeModal,
        activeModalId,
        modalData,
        modalCallback
    } = useModal<{
        item: ExpertTask;
    }>();

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    const { mutate, isLoading } = useMutation({
        fetchFn: PromosAPI.removeTask,
        onSuccess: data => {
            closeModal();

            throwSuccessToast(t("taskWasDeleted"));
            const cb = modalCallback[DELETE_TASK_MODAL];
            cb && cb(true, data);
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });
    const onDelete = () => {
        mutate({ id: modalData!.item._id });
    };

    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h2 className="text-18 font-semibold p-6">
                {t("sureToDeleteTask")}
            </h2>
            <span className="text-14 leading-5 px-6 mb-16">
                {t("sureToDeleteTaskDescription")}
            </span>

            <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                <Button
                    text={t("cancel_2")}
                    onClick={closeModal}
                    className="mr-10p"
                />
                <Button
                    text={t("yesDeleteTask")}
                    onClick={onDelete}
                    type="tertiary"
                    isDisabled={isLoading}
                />
            </div>
        </section>
    );
});
