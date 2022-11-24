import { observer } from "mobx-react-lite";
import React, {
    FC,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { MoreIcon } from "../../../../ui/atoms/MoreIcon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { TableContext } from "../../../../ui/organisms/Table";
import { authStore } from "../../../auth/store/AuthStore";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { Order } from "../../../types";
import { ROUTE_LINK_ORDERS } from "../../routes";
import { ordersStore } from "../../store/OrdersStore";
import { ORDER_CANCEL_MODAL } from "../modals/CancelModal";

interface PoppedMoreIconProps {
    item: Order<false>;
    activeTab: number;
}
export const PoppedMoreIcon: FC<PoppedMoreIconProps> = observer(
    ({ item, activeTab }) => {
        const { setEditing } = useContext(ordersStore);
        const { refetch, scrollRef } = useContext(TableContext);
        const { setModalCallback, openModal } = useContext(modalPageStore);
        const { user } = useContext(authStore);
        const { t } = useTranslation();
        const history = useHistory();
        const [isOpened, setOpened] = useState(false);
        const [
            referenceElement,
            setReference
        ] = useState<HTMLDivElement | null>();

        useEffect(() => {
            const table = scrollRef?.current;
            table?.addEventListener("scroll", onOutside);
            return () => {
                table?.removeEventListener("scroll", onOutside);
            };
        }, [scrollRef]);

        const onOutside = () => {
            setOpened(false);
        };

        const handleClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            setOpened(prev => !prev);
        };

        const onCancel = useCallback(() => {
            setOpened(false);
            setModalCallback(ORDER_CANCEL_MODAL, (isSuccess: boolean) => {
                isSuccess && refetch();
            });
            openModal(ORDER_CANCEL_MODAL, { item });
        }, [item, refetch, setModalCallback, openModal]);

        const onEdit = useCallback(() => {
            setOpened(false);
            setEditing(true);
            history.push(`${ROUTE_LINK_ORDERS}/${item._id}`);
        }, [history, item, setEditing]);

        const onPrint = useCallback(() => {
            history.push(`${ROUTE_LINK_ORDERS}/${item._id}`);
            setTimeout(() => window.print(), 1000);
        }, [history, item]);

        const onTrack = useCallback(() => {
            const newWindow = window.open(`${process.env.REACT_APP_TRACKING_URL}${item?.trackNumber}`, '_blank', 'noopener,noreferrer')
            if (newWindow) newWindow.opener = null
        }, [item?.trackNumber]);

        const popperItems = useMemo(
            () => [
                {
                    label: t("orders.track"),
                    action: onTrack,
                    visible: activeTab === 2
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
                        (activeTab === 1 &&
                            user?.role === "manufacturer" &&
                            !item?.isQvinoOrder) ||
                        ((user?.role === "admin" || user?.role === "owner") &&
                            activeTab === 1 &&
                            item?.isQvinoOrder)
                },
                {
                    label: t("cancel_1"),
                    action: onCancel,
                    visible: activeTab === 1 || activeTab === 0
                }
            ].filter(item => item.visible),
            [t, onTrack, activeTab, onPrint, onEdit, user?.role, item?.isQvinoOrder, onCancel]
        );

        return (
            <div ref={setReference}>
                <MoreIcon
                    onClick={handleClick}
                    dotsColorClass={
                        isOpened
                            ? "text-white"
                            : "text-dark-main hover:text-white"
                    }
                    circleColorClass={
                        isOpened
                            ? "text-purple-main"
                            : "text-gray-light hover:text-purple-main"
                    }
                />
                {referenceElement && isOpened && (
                    <ActionPopper
                        referenceElement={referenceElement}
                        onOutside={onOutside}
                        items={popperItems}
                    />
                )}
            </div>
        );
    }
);
