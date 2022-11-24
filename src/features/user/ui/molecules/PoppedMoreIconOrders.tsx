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
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { ROUTE_LINK_ORDERS } from "../../../orders/routes";
import { ORDER_CANCEL_MODAL } from "../../../orders/ui/modals/CancelModal";
import { Order, OrderStatus } from "../../../types";

interface PoppedMoreIconProps {
    item: Order<false>;
    status: OrderStatus;
}
export const PoppedMoreIcon: FC<PoppedMoreIconProps> = observer(
    ({ item, status }) => {
        const { refetch, scrollRef } = useContext(TableContext);
        const { setModalCallback, openModal } = useContext(modalPageStore);
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

        const onPrint = useCallback(() => {
            history.push(`${ROUTE_LINK_ORDERS}/${item._id}`);
            setTimeout(() => window.print(), 1000);
        }, [history, item]);

        const popperItems = useMemo(
            () => [
                {
                    label: t("print"),
                    action: onPrint,
                    visible: true
                },
                {
                    label: t("cancel_1"),
                    action: onCancel,
                    visible: status === "processing" || status === "new"
                }
            ],
            [t, onPrint, onCancel, status]
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
                        items={popperItems.filter(item => item.visible)}
                    />
                )}
            </div>
        );
    }
);
