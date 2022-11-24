import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { BtnIcon } from "../../../../ui/atoms/Icon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../ui/organisms/Toaster";
import { useModal } from "../../../modalpage/hooks";
import { Level } from "../../../types";
import { CertificatesAPI } from "../../../utils/api/requests/certificates-requests";
import { ROUTE_LINK_CERTIFICATES } from "../../routes";
import { certificatesStore } from "../../store/CertificatesStore";
import { ADD_LEVEL_MODAL } from "../modals/AddLevelModal";
import { DELETE_LEVEL_MODAL } from "../modals/DeleteLevelModal";
import { UNPUBLISH_LEVEL_MODAL } from "../modals/UnpublishLevel";

interface PoppedEditButtonProps {
    id?: string;
}

export const PoppedEditButtonLevel: FC<PoppedEditButtonProps> = observer(
    ({ id }) => {
        const { t } = useTranslation();
        const history = useHistory();
        const { level, certificate, setLevel } = useContext(certificatesStore);
        const { setModalCallback, openModal } = useModal();
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

        const onEdit = useCallback(() => {
            setOpened(false);
            setModalCallback(ADD_LEVEL_MODAL, (isSuccess, data: Level) => {
                isSuccess && setLevel(data);
            });
            openModal(ADD_LEVEL_MODAL, {
                item: { level: level, id: certificate?._id }
            });
        }, [certificate?._id, level, openModal, setLevel, setModalCallback]);

        const onPublishLevel = useCallback(async () => {
            try {
                level &&
                    (await CertificatesAPI.changeLevelStatus({
                        id: level?._id,
                        status: "published"
                    }));
                history.replace(
                    `${ROUTE_LINK_CERTIFICATES}/${certificate?._id}`
                );
                throwSuccessToast(t("certificate.certificatePublished"));
            } catch (e) {
                throwErrorToast(t("error"), t("unknownError"));
            }
        }, [certificate?._id, history, level, t]);

        const onUnpublish = useCallback(() => {
            setOpened(false);
            setModalCallback(UNPUBLISH_LEVEL_MODAL, () => {
                history.replace(
                    `${ROUTE_LINK_CERTIFICATES}/level/${level?._id}`
                );
            });
            openModal(UNPUBLISH_LEVEL_MODAL, { item: level });
        }, [history, level, openModal, setModalCallback]);

        const onDelete = useCallback(() => {
            setOpened(false);
            setModalCallback(DELETE_LEVEL_MODAL, () => {
                history.replace(
                    `${ROUTE_LINK_CERTIFICATES}/${certificate?._id}`
                );
            });
            openModal(DELETE_LEVEL_MODAL, { item: level });
        }, [certificate?._id, history, level, openModal, setModalCallback]);

        const popperItems = useMemo(
            () => [
                {
                    label: t("certificate.publish"),
                    action: onPublishLevel,
                    visible: level?.status === "pending"
                },
                {
                    label: t("certificate.unpublish"),
                    action: onUnpublish,
                    visible: level?.status === "published"
                },
                {
                    label: t("edit"),
                    action: onEdit,
                    visible: true
                },
                {
                    label: t("delete"),
                    action: onDelete,
                    visible: true
                }
            ],
            [t, onPublishLevel, level?.status, onUnpublish, onEdit, onDelete]
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
                        items={popperItems.filter(item => item.visible)}
                    />
                )}
            </div>
        );
    }
);
