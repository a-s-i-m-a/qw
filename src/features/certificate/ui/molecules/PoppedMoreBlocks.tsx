import { observer } from "mobx-react-lite";
import React, { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { MoreIcon } from "../../../../ui/atoms/MoreIcon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { LessonBlock } from "../../../types";
import { ROUTE_LINK_CERTIFICATES } from "../../routes";
import { certificatesStore } from "../../store/CertificatesStore";
import { DELETE_BLOCK_MODAL } from "../modals/DeleteBlockModal";
import { BLOCK_EDIT_MODAL } from "../modals/EditBlockModal";

interface PoppedMoreIconProps {
    item: LessonBlock;
}

export const PoppedMoreBlocks: FC<PoppedMoreIconProps> = observer(
    ({ item }) => {
        const { t } = useTranslation();
        const { setEditing, setCurrentBlock, loadBlocks, level } = useContext(
            certificatesStore
        );
        const { id } = useParams<Record<"id", string>>();
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

        const onAddLesson = useCallback(() => {
            setEditing(true);
            setCurrentBlock(item);
            history.replace(`${ROUTE_LINK_CERTIFICATES}/level/block/${item._id}/create`);
        }, [history, setEditing, item, setCurrentBlock]);

        const onEdit = useCallback(() => {
            setOpened(false);
            setModalCallback(BLOCK_EDIT_MODAL, () => {
                loadBlocks(level?._id);
            });
            openModal(BLOCK_EDIT_MODAL, { item: { block: item, id } });
        }, [setModalCallback, openModal, item, id, loadBlocks, level?._id]);

        const onDelete = useCallback(() => {
            setOpened(false);
            setModalCallback(DELETE_BLOCK_MODAL, () => {
                loadBlocks(level?._id);
            });
            openModal(DELETE_BLOCK_MODAL, { item });
        }, [item, level?._id, loadBlocks, openModal, setModalCallback]);

        const popperItems = useMemo(
            () => [
                {
                    label: t("certificate.addLesson"),
                    action: onAddLesson
                },
                {
                    label: t("edit"),
                    action: onEdit
                },
                {
                    label: t("delete"),
                    action: onDelete
                }
            ],
            [onAddLesson, onDelete, onEdit, t]
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
