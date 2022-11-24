import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { BtnIcon } from "../../../../ui/atoms/Icon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { ORDER_CANCEL_MODAL } from "../../../orders/ui/modals/CancelModal";
import { CHANGE_STATUS_MODAL } from "../../../orders/ui/modals/ChangeStatusModal";
import { Order } from "../../../types";
import { ROUTE_LINK_GIFT_ORDERS } from "../../routes";
import { giftOrdersStore } from "../../store/GiftOrdersStore";

export const PoppedEditButton: FC = observer(() => {
    const { t } = useTranslation();
    const history = useHistory();
    const { setModalCallback, openModal } = useContext(modalPageStore);
    const { order, setTab, setEditing } = useContext(giftOrdersStore);
    const [referenceElement, setReference] = useState<HTMLDivElement | null>();
    const [isOpened, setOpened] = useState(false);
    
    const onOutside = () => {
        setOpened(false);
    };

    const handleClick = () => {
        setOpened(true);
    };

    const onPrint = useCallback(() => {
        window.print();
    }, []);

    const onTrack = useCallback(() => {
        const newWindow = window.open(`${process.env.REACT_APP_TRACKING_URL}${order?.trackNumber}`, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [order?.trackNumber]);

    const onEdit = useCallback(() => {
        setOpened(false);
        setEditing(true);
    }, [setEditing]);

    const onDelivered = useCallback(() => {
        setOpened(false);
        setModalCallback(
            CHANGE_STATUS_MODAL,
            (isSuccess: boolean, data: Order) => {
                if (isSuccess) {
                    setTab(3);
                    history.push(ROUTE_LINK_GIFT_ORDERS);
                }
            }
        );
        openModal(CHANGE_STATUS_MODAL, { item: order });
    }, [order, history, setTab, setModalCallback, openModal])

    const onCancel = useCallback(() => {
        setOpened(false);
        setModalCallback(
            ORDER_CANCEL_MODAL,
            (isSuccess: boolean, data: Order) => {
                if (isSuccess) {
                    setTab(3);
                    history.push(ROUTE_LINK_GIFT_ORDERS);
                }
            }
        );
        openModal(ORDER_CANCEL_MODAL, { item: order });
    }, [order, history, setTab, setModalCallback, openModal]);

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
                visible: order?.status === "processing"
            },
            {
                label: t("cancel_1"),
                action: onCancel,
                visible:
                    order?.status === "processing" 
                    || order?.status === "new"
                    || order?.status === "sent"
            },
            {
                label: t("orders.orderDelivered"),
                action: onDelivered,
                visible: order?.status === "sent"
            }
        ].filter(item => item.visible),
        [t, onTrack, order?.status, onPrint, onEdit, onCancel, onDelivered]
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
