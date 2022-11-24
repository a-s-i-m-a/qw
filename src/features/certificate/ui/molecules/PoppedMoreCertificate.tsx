import { observer } from "mobx-react-lite";
import React, { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { MoreIcon } from "../../../../ui/atoms/MoreIcon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { TableContext } from "../../../../ui/organisms/Table";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../ui/organisms/Toaster";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { Certificate } from "../../../types";
import { CertificatesAPI } from "../../../utils/api/requests/certificates-requests";
import { ROUTE_LINK_CERTIFICATES } from "../../routes";
import { DELETE_CERTIFICATE_MODAL } from "../modals/DeleteCertificateModal";
import { UNPUBLISH_CERTIFICATE_MODAL } from "../modals/UnpublishCertificate";

interface PoppedMoreIconProps {
    item: Certificate;
}

export const PoppedMoreIcon: FC<PoppedMoreIconProps> = observer(({ item }) => {
    const { t } = useTranslation();
    const { setModalCallback, openModal } = useContext(modalPageStore);
    const { refetch } = useContext(TableContext);
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

    const onUnpublish = useCallback(() => {
        setOpened(false);
        setModalCallback(UNPUBLISH_CERTIFICATE_MODAL, () => {
            refetch();
        });
        openModal(UNPUBLISH_CERTIFICATE_MODAL, { item });
    }, [item, openModal, refetch, setModalCallback]);

    const onPublishCertificate = useCallback(async () => {
        try {
            await CertificatesAPI.changeCertificateStatus({
                id: item?._id,
                status: "published"
            });
            history.replace(`${ROUTE_LINK_CERTIFICATES}/${item?._id}`);
            throwSuccessToast(t("certificate.certificatePublished"));
        } catch (e) {
            throwErrorToast(t("error"), t("unknownError"));
        }
    }, [history, item?._id, t]);

    const onDelete = useCallback(() => {
        setOpened(false);
        setModalCallback(DELETE_CERTIFICATE_MODAL, () => {
            refetch();
        });
        openModal(DELETE_CERTIFICATE_MODAL, { item });
    }, [item, openModal, refetch, setModalCallback]);

    const popperItems = useMemo(
        () => [
            {
                label: t("certificate.publish"),
                action: onPublishCertificate,
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
        [t, onPublishCertificate, item, onUnpublish, onDelete]
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
