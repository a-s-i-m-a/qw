import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { PageHeader } from "../../../../ui/molecules/PageHeader";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../ui/organisms/Toaster";
import { authStore } from "../../../auth/store/AuthStore";
import { Status } from "../../../catalogue/ui/atoms/Status";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { Languages, Order, OrderStatus } from "../../../types";
import { OrdersAPI } from "../../../utils/api/requests/order-request";
import { ROUTE_LINK_ORDERS } from "../../routes";
import { ordersStore } from "../../store/OrdersStore";
import { getDetailsTitle } from "../../utils/getDetailsTitle";
import { getStatus, getStatusText } from "../../utils/getStatus";
import { transformOrder } from "../../utils/transform";
import { TRACK_EDIT_MODAL } from "../modals/TrackModal";
import { PoppedEditButton } from "./PoppedEditButton";

export const DetailsHeader = observer(() => {
    const { goBack } = useHistory();
    const history = useHistory();
    const { t, i18n } = useTranslation();
    const {
        isEditing,
        dirtyItems,
        setEditing,
        order,
        setTotal,
        setTab,
        setItems,
        clearDirtyItems
    } = useContext(ordersStore);
    const { openModal, setModalCallback } = useContext(modalPageStore);
    const { user } = useContext(authStore);
    const { id } = useParams<Record<"id", string>>();
    const { formState, reset } = useFormContext();
    const { isDirty } = formState;
    const locationState = history.location.state as {from: string};
    const handleCancel = () => {
        if (order && user) {
            setItems(id, user?.role);
            setTotal(order.total);
            reset(transformOrder(order, i18n.language as Languages));
        } else {
            goBack();
        }
        clearDirtyItems();
        setEditing(false);
    };
    const onAccept = async (id: string, status: OrderStatus) => {
        try {
            await OrdersAPI.changeStatus({
                id,
                status,
                role: user?.role === "manufacturer" ? "manufacturer" : "admin"
            });
            if (locationState?.from) {
                history.push(locationState?.from)
            } else {
                history.push(ROUTE_LINK_ORDERS);
                setTab(1);
            }
            throwSuccessToast(t("orders.statusChanged"));
        } catch {
            throwErrorToast(t("error"), t("unknownError"));
        }
    };
    const onEnterTrackNumber = () => {
        setModalCallback(
            TRACK_EDIT_MODAL,
            (isSuccess: boolean, data: Order) => {
                if (isSuccess) {
                    if (locationState?.from) {
                        history.push(locationState?.from)
                    } else {
                        setTab(2);
                        history.push(ROUTE_LINK_ORDERS);
                    }
                }
            }
        );
        openModal(TRACK_EDIT_MODAL, { item: order });
    };

    return (
        <PageHeader
            onBack={!isEditing ? goBack : undefined}
            title={getDetailsTitle(order, isEditing, t)}
            afterTitle={
                order?.status && (
                    <Status
                        status={getStatus(order.status)}
                        className="ml-5"
                        text={getStatusText(order.status, t)}
                    />
                )
            }
        >
            {isEditing ? (
                <>
                    <Button
                        text={t("cancel_1")}
                        type="secondary"
                        htmlType="button"
                        onClick={handleCancel}
                    />
                    <Button
                        htmlType="submit"
                        text={t("save")}
                        isDisabled={!isDirty && dirtyItems.length === 0}
                    />
                </>
            ) : (
                <>
                    {((user?.role === "manufacturer" &&
                        order?.status === "new" &&
                        !order?.isQvinoOrder) ||
                        ((user?.role === "admin" || user?.role === "owner") &&
                            order?.status === "new" &&
                            order?.isQvinoOrder)) && (
                        <Button
                            htmlType="button"
                            type="primary"
                            text={t("orders.acceptToWork")}
                            onClick={() => onAccept(id, "processing")}
                            className="print:hidden"
                        />
                    )}
                    {((user?.role === "manufacturer" &&
                        order?.status === "processing" &&
                        !order?.isQvinoOrder) ||
                        ((user?.role === "admin" || user?.role === "owner") &&
                            order?.status === "processing" &&
                            order?.isQvinoOrder)) && (
                        <Button
                            htmlType="button"
                            type="primary"
                            text={t("orders.enterTrackNumber")}
                            onClick={onEnterTrackNumber}
                            className="print:hidden"
                        />
                    )}
                    {((user?.role === "manufacturer" &&
                        order?.status === "sent" &&
                        !order?.isQvinoOrder) ||
                        ((user?.role === "admin" || user?.role === "owner") &&
                            order?.status === "sent" &&
                            order?.isQvinoOrder)) && (
                        <Button
                            htmlType="button"
                            type="primary"
                            text={t("orders.editTrackNumber")}
                            onClick={onEnterTrackNumber}
                            className="print:hidden"
                        />
                    )}
                    <PoppedEditButton />
                </>
            )}
        </PageHeader>
    );
});
