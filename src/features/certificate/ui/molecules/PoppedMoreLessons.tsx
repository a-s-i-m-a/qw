import { observer } from "mobx-react-lite";
import React, { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { MoreIcon } from "../../../../ui/atoms/MoreIcon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { Lesson } from "../../../types";
import { ROUTE_LINK_CERTIFICATES } from "../../routes";
import { certificatesStore } from "../../store/CertificatesStore";
import { DELETE_LESSON_MODAL } from "../modals/DeleteLessonModal";

interface PoppedMoreIconProps {
    item: Lesson;
    blockId: string;
}

export const PoppedMoreLessons: FC<PoppedMoreIconProps> = observer(
    ({ item, blockId }) => {
        const { t } = useTranslation();
        const { setEditing, loadBlocks, level } = useContext(certificatesStore);
        const { setModalCallback, openModal } = useContext(modalPageStore);
        const history = useHistory();
        const [isOpened, setOpened] = useState(false);
        const [
            referenceElement,
            setReference
        ] = useState<HTMLDivElement | null>();

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
            history.replace(`${ROUTE_LINK_CERTIFICATES}/level/block/${blockId}/${item._id}`);
        }, [setEditing, history, blockId, item._id]);

        const onDelete = useCallback(() => {
            setOpened(false);
            setModalCallback(DELETE_LESSON_MODAL, () => {
                loadBlocks(level?._id);
            });
            openModal(DELETE_LESSON_MODAL, { item });
        }, [item, level?._id, loadBlocks, openModal, setModalCallback]);

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
