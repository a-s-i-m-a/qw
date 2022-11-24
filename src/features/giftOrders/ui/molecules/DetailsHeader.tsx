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
import { Status } from "../../../catalogue/ui/atoms/Status";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { TRACK_EDIT_MODAL } from "../../../orders/ui/modals/TrackModal";
import { getDetailsTitle } from "../../../orders/utils/getDetailsTitle";
import { getStatus, getStatusText } from "../../../orders/utils/getStatus";
import { transformOrder } from "../../../orders/utils/transform";
import { Languages, OrderStatus } from "../../../types";
import { OrdersAPI } from "../../../utils/api/requests/order-request";
import { ROUTE_LINK_GIFT_ORDERS } from "../../routes";
import { giftOrdersStore } from "../../store/GiftOrdersStore";
import { PoppedEditButton } from "./PoppedEditButton";

export const DetailsHeader = observer(() => {
    const { goBack } = useHistory();
    const history = useHistory();
    const { t, i18n } = useTranslation();
    const {
        isEditing,
        setEditing,
        order,
        setTab
    } = useContext(giftOrdersStore);
    const { openModal, setModalCallback } = useContext(modalPageStore);
    const { id } = useParams<Record<"id", string>>();
    const { formState, reset } = useFormContext();
    const { isDirty } = formState;
    const locationState = history.location.state as {from: string};

    const handleCancel = () => {
        if (order) {
            reset(transformOrder(order, i18n.language as Languages));
        } else {
            goBack();
        }
        setEditing(false);
    };
    const onAccept = async (id: string, status: OrderStatus) => {
        try {
            await OrdersAPI.changeStatus({
                id,
                status,
                role: "admin"
            });
            if (locationState?.from) {
                history.push(locationState?.from)
            } else {
                history.push(ROUTE_LINK_GIFT_ORDERS);
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
            (isSuccess: boolean) => {
                if (isSuccess) {
                    if (locationState?.from) {
                        history.push(locationState?.from)
                    } else {
                        setTab(2);
                        history.push(ROUTE_LINK_GIFT_ORDERS);
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
                        isDisabled={!isDirty}
                    />
                </>
            ) : (
                <>
                    {order?.status === "new"
                        && (
                            <Button
                                htmlType="button"
                                type="primary"
                                text={t("orders.acceptToWork")}
                                onClick={() => onAccept(id, "processing")}
                                className="print:hidden"
                            />
                        )}
                    {order?.status === "processing"
                     && (
                            <Button
                                htmlType="button"
                                type="primary"
                                text={t("orders.enterTrackNumber")}
                                onClick={onEnterTrackNumber}
                                className="print:hidden"
                            />
                        )}
                    {order?.status === "sent" && (
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
