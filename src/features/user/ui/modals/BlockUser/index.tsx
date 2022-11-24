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
import { UserAPI } from "../../../../utils/api/requests/user-requests";
import { User } from "../../../../types";

interface BlockModalProps {
    id: string;
}

export const BLOCK_USER_MODAL = "BLOCK_USER_MODAL";

export const BlockUserModal: FC<BlockModalProps> = observer(({ id }) => {
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

    const { mutate } = useMutation({
        fetchFn: UserAPI.blockUser,
        onSuccess: data => {
            closeModal();

            throwSuccessToast(
                t("hasBeenBlocked", {
                    word: t(`${modalData?.item.role!}.plural_0`)
                }),
                t("hasMovedToBlockedTab", {
                    word: t(`${modalData?.item.role!}.plural_0`)
                })
            );
            closeModal();
            const cb = modalCallback[BLOCK_USER_MODAL];
            cb && cb(true, data);
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });
    const handleUserBlock = () => {
        mutate({
            id: modalData!.item._id
        });
    };

    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h2 className="text-18 font-semibold p-6">
                {t("areUSureToBlock", {
                    word: t(`${modalData?.item.role!}.plural_2`).toLowerCase()
                })}
            </h2>
            <span className="text-14 leading-5 px-6 mb-16">
                {t("willBeBlocked", {
                    word: t(`${modalData?.item.role!}.plural_0`)
                })}
            </span>

            <div className="w-full bg-gray-bg mt-16 p-6 flex rounded-b-20p">
                <Button text={t("cancel_2")} onClick={closeModal} />
                <Button
                    className="ml-4"
                    text={t("blockConfirm")}
                    onClick={handleUserBlock}
                    type="tertiary"
                />
            </div>
        </section>
    );
});
