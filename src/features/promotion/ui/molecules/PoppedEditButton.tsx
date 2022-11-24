import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { FC, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { BtnIcon } from "../../../../ui/atoms/Icon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { PROMOTION_DELETE_MODAL } from "../modals/DeleteModal";

interface PoppedEditButtonProps {
    id?: string;
}

export const PoppedEditButton: FC<PoppedEditButtonProps> = observer(
    ({ id }) => {
        const { t } = useTranslation();
        const history = useHistory();
        const { openModal, setModalCallback } = useContext(modalPageStore);

        const [
            referenceElement,
            setReference
        ] = useState<HTMLDivElement | null>();
        const onOutside = () => {
            setOpened(false);
        };

        const [isOpened, setOpened] = useState(false);

        const handleClick = () => {
            setOpened(true);
        };
        const onDelete = useCallback(() => {
            setModalCallback(PROMOTION_DELETE_MODAL, () => {
                history.goBack();
            });
            openModal(PROMOTION_DELETE_MODAL, { id });
        }, [history, id, openModal, setModalCallback]);
        const popperItems = useMemo(
            () => [
                {
                    label: t("deleteApplication"),
                    action: onDelete
                }
            ],
            [onDelete, t]
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
    }
);
