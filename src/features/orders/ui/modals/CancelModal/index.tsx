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
import { Order } from "../../../../types";
import { OrdersAPI } from "../../../../utils/api/requests/order-request";
import { useMutation } from "../../../../utils/hooks/useMutation";

interface CancelModalProps {
    id: string;
}

export const ORDER_CANCEL_MODAL = "ORDER_CANCEL_MODAL";

export const CancelModal: FC<CancelModalProps> = observer(({ id }) => {
    const {
        register,
        activeModalId,
        closeModal,
        modalData,
        modalCallback
    } = useModal<{
        item: Order;
    }>();
    const { t } = useTranslation();
    const { user } = useContext(authStore);
    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    const { mutate, isLoading } = useMutation({
        fetchFn: OrdersAPI.cancelOrder,
        onSuccess: () => {
            throwSuccessToast(
                t("orders.orderCancelled"),
                t("orders.orderCancelledDesc")
            );
            const cb = modalCallback[ORDER_CANCEL_MODAL];
            cb && cb(true);
        },
        onError: () => throwErrorToast(t("error"), t("unknownError"))
    });

    const onDelete = () => {
        if (modalData?.item._id) {
            mutate({
                id: modalData?.item._id,
                role: user?.role === "manufacturer" ? "manufacturer" : "admin"
            });
        }
        closeModal();
    };

    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h4 className="text-18 font-semibold p-6">
                {t(`orders.sureToCancelOrder`)}
            </h4>
            <span className="text-14 leading-5 mb-16 px-6">
                {t(`orders.sureToCancelOrderDescr`)}
            </span>

            <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                <Button
                    onClick={closeModal}
                    isDisabled={isLoading}
                    text={t("cancel_2")}
                />

                <Button
                    text={t("orders.yesCancelOrder")}
                    type="tertiary"
                    className="ml-4"
                    onClick={onDelete}
                />
            </div>
        </section>
    );
});
