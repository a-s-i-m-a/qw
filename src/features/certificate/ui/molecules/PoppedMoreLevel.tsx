import { observer } from "mobx-react-lite";
import React, { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MoreIcon } from "../../../../ui/atoms/MoreIcon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../ui/organisms/Toaster";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { Level } from "../../../types";
import { CertificatesAPI } from "../../../utils/api/requests/certificates-requests";
import { certificatesStore } from "../../store/CertificatesStore";
import { DELETE_LEVEL_MODAL } from "../modals/DeleteLevelModal";
import { UNPUBLISH_LEVEL_MODAL } from "../modals/UnpublishLevel";

interface PoppedMoreIconProps {
    item: Level;
}

export const PoppedMoreLevel: FC<PoppedMoreIconProps> = observer(({ item }) => {
    const { t } = useTranslation();
    const { loadLevels, certificate } = useContext(certificatesStore);
    const { setModalCallback, openModal } = useContext(modalPageStore);
    const [isOpened, setOpened] = useState(false);
    const [referenceElement, setReference] = useState<HTMLDivElement | null>();

    const onOutside = () => {
        setOpened(false);
    };

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setOpened(prev => !prev);
    };

    const onUnpublish = useCallback(() => {
        setOpened(false);
        setModalCallback(UNPUBLISH_LEVEL_MODAL, () => {
            loadLevels("-sortNumber", certificate?._id);
        });
        openModal(UNPUBLISH_LEVEL_MODAL, { item });
    }, [certificate?._id, item, loadLevels, openModal, setModalCallback]);

    const onPublishLevel = useCallback(async () => {
        try {
            await CertificatesAPI.changeLevelStatus({
                id: item?._id,
                status: "published"
            });
            loadLevels("-sortNumber", certificate?._id);
            throwSuccessToast(t("certificate.certificatePublished"));
        } catch (e) {
            throwErrorToast(t("error"), t("unknownError"));
        }
    }, [certificate?._id, item?._id, loadLevels, t]);

    const onDelete = useCallback(() => {
        setOpened(false);
        setModalCallback(DELETE_LEVEL_MODAL, () => {
            loadLevels("-sortNumber", certificate?._id);
        });
        openModal(DELETE_LEVEL_MODAL, { item });
    }, [certificate?._id, item, loadLevels, openModal, setModalCallback]);

    const popperItems = useMemo(
        () => [
            {
                label: t("certificate.publish"),
                action: onPublishLevel,
                visible: item.status === "pending"
            },
            {
                label: t("certificate.unpublish"),
                action: onUnpublish,
                visible: item.status === "published"
            },
            {
                label: t("delete"),
                action: onDelete,
                visible: true
            }
        ],
        [t, onPublishLevel, item.status, onUnpublish, onDelete]
    );

    return (
        <div ref={setReference}>
            <MoreIcon
                onClick={e => handleClick(e)}
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
                    items={popperItems.filter(item => item.visible)}
                />
            )}
        </div>
    );
});
