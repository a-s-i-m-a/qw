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
import { ROUTE_LINK_GIFTS } from "../../routes";
import { giftsStore } from "../../store/GiftsStore";
import { DELETE_GIFT_MODAL } from "../modals/DeleteGift";

export const PoppedEditButton: FC = observer(() => {
    const { t } = useTranslation();
    const { setModalCallback, openModal } = useContext(modalPageStore);
    const { gift, setGiftEditing } = useContext(giftsStore);
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
        setOpened(false);
        setGiftEditing(true);
    }, [setGiftEditing]);

    const onDelete = useCallback(() => {
        setOpened(false);
        setModalCallback(DELETE_GIFT_MODAL, (isSuccess: boolean) => {
            isSuccess && history.push(ROUTE_LINK_GIFTS);
        });
        openModal(DELETE_GIFT_MODAL, { item: gift });
    }, [history, openModal, setModalCallback, gift]);

    const popperItems = useMemo(
        () => [
            {
                label: t("edit"),
                action: onEdit
            },
            {
                label: t("delete"),
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