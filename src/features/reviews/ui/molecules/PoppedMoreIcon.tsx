import { observer } from "mobx-react-lite";
import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MoreIcon } from "../../../../ui/atoms/MoreIcon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { TableContext } from "../../../../ui/organisms/Table";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { REVIEW_DELETE_MODAL } from "../modals/DeleteModal";

interface PoppedMoreIconProps {
    id: string;
}
export const PoppedMoreIcon: FC<PoppedMoreIconProps> = observer(({ id }) => {
    const { t } = useTranslation();
    const [isOpened, setOpened] = useState(false);
    const { scrollRef, refetch } = useContext(TableContext);
    const { setModalCallback, openModal } = useContext(modalPageStore);
    const [referenceElement, setReference] = useState<HTMLDivElement | null>();
    const onOutside = () => {
        setOpened(false);
    };
    useEffect(() => {
        const table = scrollRef?.current;
        table?.addEventListener("scroll", onOutside);
        return () => {
            table?.removeEventListener("scroll", onOutside);
        };
    }, [scrollRef]);
    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setOpened(prev => !prev);
    };

    const onDelete = useCallback(() => {
        setOpened(false);
        setModalCallback(REVIEW_DELETE_MODAL, () => {
            refetch();
        });
        openModal(REVIEW_DELETE_MODAL, {
            id
        });
    }, [id, openModal, refetch, setModalCallback]);

    const popperItems = useMemo(
        () => [{ label: t("deleteApplication"), action: onDelete }],
        [onDelete, t]
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
