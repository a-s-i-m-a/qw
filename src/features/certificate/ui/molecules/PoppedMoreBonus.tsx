import { observer } from "mobx-react-lite";
import React, { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { MoreIcon } from "../../../../ui/atoms/MoreIcon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { BonusLesson } from "../../../types";
import { ROUTE_LINK_CERTIFICATES } from "../../routes";
import { certificatesStore } from "../../store/CertificatesStore";
import { DELETE_BONUSLESSON_MODAL } from "../modals/DeleteBonusLessonModal";

interface PoppedMoreIconProps {
    item: BonusLesson;
}

export const PoppedMoreBonus: FC<PoppedMoreIconProps> = observer(({ item }) => {
    const { t } = useTranslation();
    const { setEditing, level, loadLevel } = useContext(certificatesStore);
    const { setModalCallback, openModal } = useContext(modalPageStore);
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
        setOpened(false);
        setEditing(true);
        history.push(`${ROUTE_LINK_CERTIFICATES}/level/${level?._id}/${item._id}`);
    }, [setEditing, history, level?._id, item._id]);

    const onDelete = useCallback(() => {
        setOpened(false);
        setModalCallback(DELETE_BONUSLESSON_MODAL, () => {
            level?._id && loadLevel(level?._id);
        });
        openModal(DELETE_BONUSLESSON_MODAL, { item });
    }, [item, level?._id, loadLevel, openModal, setModalCallback]);

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
        [onDelete, onEdit, t]
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
