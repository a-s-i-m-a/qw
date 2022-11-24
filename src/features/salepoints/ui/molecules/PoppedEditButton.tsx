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
import { ROUTE_LINK_SALEPOINTS } from "../../routes";
import { salepointsStore } from "../../store/SalepointsStore";
import { DELETE_SALEPOINT_MODAL } from "../modals/DeleteSalepoint";

export const PoppedEditButton: FC = observer(() => {
    const { t } = useTranslation();
    const { setModalCallback, openModal } = useContext(modalPageStore);
    const { salepoint, setEditing } = useContext(salepointsStore);
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
        setModalCallback(DELETE_SALEPOINT_MODAL, (isSuccess: boolean) => {
            isSuccess && history.push(ROUTE_LINK_SALEPOINTS);
        });
        openModal(DELETE_SALEPOINT_MODAL, { item: salepoint });
    }, [history, openModal, setModalCallback, salepoint]);

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
