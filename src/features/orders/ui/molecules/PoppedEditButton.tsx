import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { BtnIcon } from "../../../../ui/atoms/Icon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { authStore } from "../../../auth/store/AuthStore";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { Order } from "../../../types";
import { ROUTE_LINK_ORDERS } from "../../routes";
import { ordersStore } from "../../store/OrdersStore";
import { ORDER_CANCEL_MODAL } from "../modals/CancelModal";
import { CHANGE_STATUS_MODAL } from "../modals/ChangeStatusModal";

export const PoppedEditButton: FC = observer(() => {
    const { t } = useTranslation();
    const { user } = useContext(authStore);

    const { setModalCallback, openModal } = useContext(modalPageStore);
    const { order, setEditing, setTab } = useContext(ordersStore);
    const history = useHistory();
    const [referenceElement, setReference] = useState<HTMLDivElement | null>();
    const [isOpened, setOpened] = useState(false);
    const locationState = history.location.state as {from: string};
    const onOutside = () => {
        setOpened(false);
    };

    const handleClick = () => {
        setOpened(true);
    };

    const onEdit = useCallback(() => {
        setOpened(false);
        setEditing(true);
    }, [setEditing]);

    const onPrint = useCallback(() => {
        window.print();
    }, []);

    const onTrack = useCallback(() => {
        const newWindow = window.open(`${process.env.REACT_APP_TRACKING_URL}${order?.trackNumber}`, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [order?.trackNumber]);

    const onDelivered = useCallback(() => {
        setOpened(false);
        setModalCallback(
            CHANGE_STATUS_MODAL,
            (isSuccess: boolean, data: Order) => {
                if (isSuccess) {
                    if (locationState?.from) {
                        history.push(locationState?.from)
                    } else {
                        history.push(ROUTE_LINK_ORDERS);
                        setTab(3);
                    } 
                }
            }
        );
        openModal(CHANGE_STATUS_MODAL, { item: order });
    }, [setModalCallback, openModal, order, locationState, setTab, history]);

    const onCancel = useCallback(() => {
        setOpened(false);
        setModalCallback(
            ORDER_CANCEL_MODAL,
            (isSuccess: boolean, data: Order) => {
                if (isSuccess) {
                    if (isSuccess) {
                        if (locationState?.from) {
                            history.push(locationState?.from)
                        } else {
                            history.push(ROUTE_LINK_ORDERS);
                            setTab(3);
                        } 
                    }
                }
            }
        );
        openModal(ORDER_CANCEL_MODAL, { item: order });
    }, [setModalCallback, openModal, order, locationState?.from, history, setTab]);

    const popperItems = useMemo(
        () => [
            {
                label: t("orders.track"),
                action: onTrack,
                visible: order?.status === "sent"
            },
            {
                label: t("print"),
                action: onPrint,
                visible: true
            },
            {
                label: t("edit"),
                action: onEdit,
                visible:
                    (user?.role === "manufacturer" &&
                        order?.status === "processing" &&
                        !order?.isQvinoOrder) ||
                    ((user?.role === "admin" || user?.role === "owner") &&
                        order?.status === "processing" &&
                        order?.isQvinoOrder)
            },
            {
                label: t("cancel_1"),
                action: onCancel,
                visible:
                    order?.status === "processing" ||
                    order?.status === "new" ||
                    ((user?.role === "admin" || user?.role === "owner") &&
                        order?.status === "sent")
            },
            {
                label: t("orders.orderDelivered"),
                action: onDelivered,
                visible:
                    (user?.role === "admin" || user?.role === "owner") &&
                    order?.status === "sent"
            }
        ].filter(item => item.visible),
        [t, onTrack, order?.status, order?.isQvinoOrder, onPrint, onEdit, user?.role, onCancel, onDelivered]
    );

    return (
        <div ref={setReference}>
            <Button
                onClick={handleClick}
                type={"icon"}
                htmlType="button"
                className="print:hidden"
            >
                <BtnIcon />
            </Button>
            {referenceElement && isOpened && (
                <ActionPopper
                    referenceElement={referenceElement}
                    onOutside={onOutside}
                    items={popperItems}
                />
            )}
        </div>
    );
});
