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
import { User } from "../../../../types";
import { UserAPI } from "../../../../utils/api/requests/user-requests";

interface DeleteModalProps {
    id: string;
}

export const DELETE_USER_MODAL = "DELETE_USER_MODAL";

export const DeleteUserModal: FC<DeleteModalProps> = observer(({ id }) => {
    const { t } = useTranslation();

    const {
        register,
        closeModal,
        activeModalId,
        modalData,
        modalCallback
    } = useModal<{
        item: User;
    }>();

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    const { mutate, isLoading } = useMutation({
        fetchFn: UserAPI.removeUser,
        onSuccess: data => {
            closeModal();

            throwSuccessToast(
                t("hasDeleted", {
                    word: t(`${modalData?.item.role!}.plural_0`)
                }),
                t("accountTransferedToDeleted")
            );
            const cb = modalCallback[DELETE_USER_MODAL];
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
                {t("areUSureToDelete", {
                    word: t(`${modalData?.item.role!}.plural_2`).toLowerCase()
                })}
            </h2>
            <span className="text-14 leading-5 px-6 mb-16">
                {t("dataWillBeDeleted", {
                    word: t(`${modalData?.item.role!}.plural_3`).toLowerCase()
                })}
            </span>

            <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                <Button
                    text={t("cancel_2")}
                    onClick={closeModal}
                    className="mr-10p"
                    isDisabled={isLoading}
                />
                <Button
                    text={t("deleteConfirm")}
                    onClick={onDelete}
                    type="tertiary"
                />
            </div>
        </section>
    );
});
