import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { Product } from "../../../../types";
import { CatalogueAPI } from "../../../../utils/api/requests/catalogue-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";

interface DeleteModalProps {
    id: string;
}

export const DELETE_PRODUCT_PROMOTION_MODAL = "DELETE_PRODUCT_PROMOTION_MODAL";

export const DeletePromotionModal: FC<DeleteModalProps> = observer(({ id }) => {
    const {
        register,
        closeModal,
        activeModalId,
        modalCallback,
        modalData
    } = useModal<{ item: Product }>();
    const { t } = useTranslation();

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);
    const { mutate, isLoading } = useMutation({
        fetchFn: CatalogueAPI.removeFromPromotion,
        onSuccess: data => {
            closeModal();
            const cb = modalCallback[DELETE_PRODUCT_PROMOTION_MODAL];
            cb && cb(true, data);
            throwSuccessToast(t("removeFromPromotionModal.wineDepromoted"));
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });
    const onDelete = () => {
        modalData &&
            mutate({
                id: modalData?.item._id
            });
    };
    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h4 className="text-18 font-semibold p-6">
                {t("removeFromPromotionModal.title")}
            </h4>
            <span className="text-14 leading-5 mb-16 px-6">
                {t("removeFromPromotionModal.description")}
            </span>

            <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                <Button onClick={closeModal} text={t("cancel_2")} />
                <Button
                    text={t("removeFromPromotionModal.confirm")}
                    type="tertiary"
                    className="ml-4"
                    onClick={onDelete}
                    isDisabled={isLoading}
                />
            </div>
        </section>
    );
});
