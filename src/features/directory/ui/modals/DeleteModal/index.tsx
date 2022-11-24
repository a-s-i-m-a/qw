import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { useMutation } from "../../../../utils/hooks/useMutation";

interface DeleteModalProps {
    id: string;
}

export const DIRECTORY_DELETE_MODAL = "DIRECTORY_DELETE_MODAL";

export const DeleteModal: FC<DeleteModalProps> = observer(({ id }) => {
    const {
        register,
        closeModal,
        activeModalId,
        modalCallback,
        modalData
    } = useModal<{
        id: string;
        i18n:
            | "region"
            | "wineStyle"
            | "manufacturer"
            | "grapeSort"
            | "retailer";
        removeFn: () => void;
    }>();
    const { t } = useTranslation();
    useEffect(() => {
        register({
            id
        });
    }, [id, register]);
    const { mutate, isLoading } = useMutation({
        fetchFn: modalData?.removeFn as () => Promise<void>,
        onSuccess: () => {
            closeModal();
            const cb = modalCallback[id];
            cb && cb(true);
            throwSuccessToast(
                t(`${i18n}.deleteTitle`),
                t(`${i18n}.deleteDescription`)
            );
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });
    const onDelete = () => {
        mutate({ id: itemId! });
    };
    if (activeModalId !== id || !modalData) return null;

    const { i18n, id: itemId } = modalData;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h4 className="text-18 font-semibold p-6">
                {t(`${i18n}.deleteConfirm`)}
            </h4>
            <span className="text-14 leading-5 mb-16 px-6">
                {t(`${i18n}.deleteConfirmDescription`)}
            </span>

            <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                <Button onClick={closeModal} text={t("cancel_2")} />
                <Button
                    text={t("deleteConfirm")}
                    type="tertiary"
                    className="ml-4"
                    onClick={onDelete}
                    isDisabled={isLoading}
                />
            </div>
        </section>
    );
});
