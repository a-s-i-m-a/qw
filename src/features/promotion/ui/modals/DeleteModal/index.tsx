import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { authStore } from "../../../../auth/store/AuthStore";
import { useModal } from "../../../../modalpage/hooks";
import { Role } from "../../../../types";
import { PromosAPI } from "../../../../utils/api/requests/promos-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";

interface DeleteModalProps {
    id: string;
}

export const PROMOTION_DELETE_MODAL = "PROMOTION_DELETE_MODAL";

export const DeleteModal: FC<DeleteModalProps> = observer(({ id }) => {
    const {
        register,
        activeModalId,
        closeModal,
        modalData,
        modalCallback
    } = useModal<{
        id: string;
        callback?: () => void;
    }>();
    const { user } = useContext(authStore);
    const { t } = useTranslation();
    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    const { mutate, isLoading } = useMutation({
        fetchFn: ({ role, id }: { role?: Role; id: string }) => {
            return role === "manufacturer"
                ? PromosAPI.removeApplication({ id })
                : PromosAPI.rejectPromo({ id });
        },
        onSuccess: () => {
            throwSuccessToast(t("applicationHasDeleted"));

            const cb = modalCallback[PROMOTION_DELETE_MODAL];
            cb && cb(true);
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });

    const onDelete = () => {
        if (modalData?.id) {
            mutate({ role: user?.role, id: modalData.id });
        }

        closeModal();
    };

    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h4 className="text-18 font-semibold p-6">
                {t(`sureToDeletePromotion`)}
            </h4>
            <span className="text-14 leading-5 mb-16 px-6">
                {t(`promotionWillBeDeleted`)}
            </span>

            <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                <Button
                    onClick={closeModal}
                    isDisabled={isLoading}
                    text={t("cancel_2")}
                />

                <Button
                    text={t("deletePromotion")}
                    type="tertiary"
                    className="ml-4"
                    onClick={onDelete}
                />
            </div>
        </section>
    );
});
