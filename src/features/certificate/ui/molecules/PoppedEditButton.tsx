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
import { CertificatesAPI } from "../../../utils/api/requests/certificates-requests";
import { ROUTE_LINK_CERTIFICATES } from "../../routes";
import { certificatesStore } from "../../store/CertificatesStore";
import { DELETE_CERTIFICATE_MODAL } from "../modals/DeleteCertificateModal";
import { UNPUBLISH_CERTIFICATE_MODAL } from "../modals/UnpublishCertificate";

interface PoppedEditButtonProps {
    id?: string;
}

export const PoppedEditButton: FC<PoppedEditButtonProps> = observer(
    ({ id }) => {
        const { t } = useTranslation();
        const history = useHistory();
        const { certificate } = useContext(certificatesStore);
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

        const onUnpublish = useCallback(() => {
            setOpened(false);
            setModalCallback(UNPUBLISH_CERTIFICATE_MODAL, () => {
                history.replace(ROUTE_LINK_CERTIFICATES);
            });
            openModal(UNPUBLISH_CERTIFICATE_MODAL, { item: certificate });
        }, [certificate, history, openModal, setModalCallback]);

        const onPublishCertificate = useCallback(async () => {
            try {
                certificate &&
                    (await CertificatesAPI.changeCertificateStatus({
                        id: certificate?._id,
                        status: "published"
                    }));
                history.replace(
                    `${ROUTE_LINK_CERTIFICATES}/${certificate?._id}`
                );
                throwSuccessToast(t("certificate.certificatePublished"));
            } catch (e) {
                throwErrorToast(t("error"), t("unknownError"));
            }
        }, [certificate, history, t]);

        const onDelete = useCallback(() => {
            setOpened(false);
            setModalCallback(DELETE_CERTIFICATE_MODAL, () => {
                history.replace(ROUTE_LINK_CERTIFICATES);
            });
            openModal(DELETE_CERTIFICATE_MODAL, { item: certificate });
        }, [certificate, history, openModal, setModalCallback]);

        const popperItems = useMemo(
            () => [
                {
                    label: t("certificate.publish"),
                    action: onPublishCertificate,
                    visible: certificate?.status === "pending"
                },
                {
                    label: t("certificate.unpublish"),
                    action: onUnpublish,
                    visible: certificate?.status === "published"
                },
                {
                    label: t("delete"),
                    action: onDelete,
                    visible: true
                }
            ],
            [t, onPublishCertificate, certificate, onUnpublish, onDelete]
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
