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

interface RemoveFromSaleModalProps {
    id: string;
}

export const REMOVE_FROM_SALE_MODAL = "REMOVE_FROM_SALE_MODAL";

export const RemoveFromSaleModal: FC<RemoveFromSaleModalProps> = observer(
    ({ id }) => {
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
            fetchFn: CatalogueAPI.removeFromStore,
            onSuccess: data => {
                closeModal();
                const cb = modalCallback[REMOVE_FROM_SALE_MODAL];
                cb && cb(true, data);
                throwSuccessToast(t("wineRemovedFromSale"));
            },
            onError: () => throwErrorToast(t("error"), t("unknownError"))
        });
        const onDelete = () => {
            mutate({ id: modalData?.item._id! });
        };
        if (activeModalId !== id) return null;

        return (
            <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
                <h4 className="text-18 font-semibold p-6">
                    {t("sureToRemoveFromSale")}
                </h4>
                <span className="text-14 leading-5 mb-16 px-6">
                    {t("sureToRemoveFromSaleDescription")}
                </span>

                <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                    <Button onClick={closeModal} text={t("cancel_2")} />
                    <Button
                        text={t("removeFromSaleConfirm")}
                        type="tertiary"
                        className="ml-4"
                        onClick={onDelete}
                        isDisabled={isLoading}
                    />
                </div>
            </section>
        );
    }
);
