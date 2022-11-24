import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useContext } from "react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { BtnIcon } from "../../../../ui/atoms/Icon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { ROUTE_LINK_DISCOUNTS } from "../../routes";
import { discountsStore } from "../../store/DiscountsStore";
import { DELETE_DISCOUNT_MODAL } from "../modals/DeleteDiscount";

export const PoppedEditButton: FC = observer(() => {
    const { t } = useTranslation();
    const { setModalCallback, openModal } = useContext(modalPageStore);
    const { discount, setEditing } = useContext(discountsStore);
    const history = useHistory();
    const [referenceElement, setReference] = useState<HTMLDivElement | null>();
    const [isOpened, setOpened] = useState(false);
    const handleClick = () => {
        setOpened(true);
    };
    const onOutside = () => {
        setOpened(false);
    };
    const onEdit = useCallback(() => {
        setEditing(true);
        setOpened(false);
    }, [setEditing]);
    const onDelete = useCallback(() => {
        setOpened(false);
        setModalCallback(DELETE_DISCOUNT_MODAL, (isSuccess: boolean) => {
            isSuccess && history.push(ROUTE_LINK_DISCOUNTS);
        });
        openModal(DELETE_DISCOUNT_MODAL, { item: discount });
    }, [history, openModal, setModalCallback, discount]);
    const popperItems = useMemo(
        () => [
            {
                label: t("edit"),
                action: onEdit
            },
            {
                label: t("discounts.deleteDiscount"),
                action: onDelete
            }
        ],
        [onEdit, onDelete, t]
    );

    return (
        <div ref={setReference}>
            <Button onClick={handleClick} type={"icon"} htmlType="button">
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
