import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../../../../../ui/atoms/Button";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { Level } from "../../../../types";
import { CertificatesAPI } from "../../../../utils/api/requests/certificates-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";

interface DeleteModalProps {
    id: string;
}

export const DELETE_LEVEL_MODAL = "DELETE_LEVEL_MODAL";

export const DeleteLevelModal: FC<DeleteModalProps> = observer(({ id }) => {
    const { t } = useTranslation();
    const {
        register,
        closeModal,
        activeModalId,
        modalData,
        modalCallback
    } = useModal<{
        item: Level;
    }>();

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    const { mutate, isLoading } = useMutation({
        fetchFn: CertificatesAPI.removeLevel,
        onSuccess: data => {
            closeModal();

            throwSuccessToast(
                t("hasDeleted", {
                    word: t("certificate.level.plural_0")
                })
            );
            const cb = modalCallback[DELETE_LEVEL_MODAL];
            cb && cb(true, data);
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });

    const onDelete = () => {
        if (modalData?.item?._id) {
            mutate({ id: modalData!?.item?._id });
        }
    };

    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h4 className="text-18 font-semibold p-6">
                {t("certificate.sureToDeleteLevel")}
            </h4>
            <span className="text-14 leading-5 mb-16 px-6">
                {t("certificate.sureToDeleteLevelDescr")}
            </span>

            <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                <Button
                    text={t("cancel_2")}
                    onClick={closeModal}
                    className="mr-10p"
                />
                <Button
                    text={t("deleteConfirm")}
                    onClick={onDelete}
                    type="tertiary"
                    isDisabled={isLoading}
                />
            </div>
        </section>
    );
});
