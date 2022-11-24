import { observer } from "mobx-react-lite";
import React, { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { MoreIcon } from "../../../../ui/atoms/MoreIcon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { TableContext } from "../../../../ui/organisms/Table";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { ROUTE_LINK_GIFTS } from "../../routes";
import { giftsStore } from "../../store/GiftsStore";
import { GiftPayload } from "../../types";
import { DELETE_GIFT_MODAL } from "../modals/DeleteGift";

interface PoppedMoreIconProps {
    item: GiftPayload;
}

export const PoppedMoreIcon: FC<PoppedMoreIconProps> = observer(({ item }) => {
    const { t } = useTranslation();
    const { setGiftEditing } = useContext(giftsStore);
    const { setModalCallback, openModal } = useContext(modalPageStore);
    const { refetch } = useContext(TableContext);
    const history = useHistory();
    const [isOpened, setOpened] = useState(false);
    const [referenceElement, setReference] = useState<HTMLDivElement | null>();

    const onOutside = () => {
        setOpened(false);
    };

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setOpened(prev => !prev);
    };

    const onEdit = useCallback(() => {
        setGiftEditing(true);
        history.push(`${ROUTE_LINK_GIFTS}/${item._id}`);
    }, [history, item, setGiftEditing]);

    const onDelete = useCallback(() => {
        setOpened(false);
        setModalCallback(DELETE_GIFT_MODAL, () => {
            refetch();
        });
        openModal(DELETE_GIFT_MODAL, { item });
    }, [item, openModal, refetch, setModalCallback]);

    const popperItems = useMemo(
        () => [
            {
                label: t("edit"),
                action: onEdit
            },
            {
                label: t("gift.deleteGift"),
                action: onDelete
            }
        ],
        [onEdit, onDelete, t]
    );

    return (
        <div ref={setReference}>
            <MoreIcon
                onClick={handleClick}
                dotsColorClass={
                    isOpened ? "text-white" : "text-dark-main hover:text-white"
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
});