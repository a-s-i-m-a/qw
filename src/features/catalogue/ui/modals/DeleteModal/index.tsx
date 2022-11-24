import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { authStore } from "../../../../auth/store/AuthStore";
import { useModal } from "../../../../modalpage/hooks";
import { CatalogueAPI } from "../../../../utils/api/requests/catalogue-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { catalogueStore } from "../../../store/CatalogueStore";

interface DeleteModalProps {
    id: string;
}

export const DELETE_PRODUCT_MODAL = "DELETE_PRODUCT_MODAL";

export const DeleteModal: FC<DeleteModalProps> = observer(({ id }) => {
    const { productAwaitingForDeleting } = useContext(catalogueStore);
    const { user } = useContext(authStore);
    const { register, closeModal, activeModalId, modalCallback } = useModal();
    const { t } = useTranslation();

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);
    const { mutate, isLoading } = useMutation({
        fetchFn: CatalogueAPI.removeProduct,
        onSuccess: data => {
            closeModal();
            const cb = modalCallback[DELETE_PRODUCT_MODAL];
            cb && cb(true, data);
            throwSuccessToast(
                t("wineHasDeleted"),
                t("wineTransferedToDeleted")
            );
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });
    const onDelete = () => {
        mutate({
            id: productAwaitingForDeleting!,
            role: user?.role === "manufacturer" ? "manufacturer" : "admin"
        });
    };
    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h4 className="text-18 font-semibold p-6">
                {t("sureToDeleteProduct")}
            </h4>
            <span className="text-14 leading-5 mb-16 px-6">
                {t("sureToDeleteProductDescription")}
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
