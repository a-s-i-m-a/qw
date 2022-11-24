import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { PageHeader } from "../../../../ui/molecules/PageHeader";
import { Status } from "../../../catalogue/ui/atoms/Status";
import { useModal } from "../../../modalpage/hooks";
import { Certificate } from "../../../types";
import { ROUTE_LINK_CERTIFICATES } from "../../routes";
import { certificatesStore } from "../../store/CertificatesStore";
import { getStatus, getStatusTitle } from "../../utils/detailsHelper";
import { ADD_LEVEL_MODAL } from "../modals/AddLevelModal";
import { BLOCK_EDIT_MODAL } from "../modals/EditBlockModal";
import { PoppedCreateButton } from "./PoppedCreateButton";
import { PoppedEditButton } from "./PoppedEditButton";
import { PoppedEditButtonLevel } from "./PoppedEditButtonLevel";

interface DetailsHeaderProps {
    isCertificate: boolean;
}

export const DetailsHeader: FC<DetailsHeaderProps> = observer(
    ({ isCertificate }) => {
        const { id } = useParams<Record<"id", string>>();
        const { setModalCallback, openModal } = useModal();
        const { pathname } = useLocation();
        const certificateId = pathname.split("/")[2]; 
        const history = useHistory();
        const { t } = useTranslation();
        const { levels, blocks, certificate, level } = useContext(
            certificatesStore
        );
        const goBack = () => {
            isCertificate
                ? history.replace(ROUTE_LINK_CERTIFICATES)
                : history.replace(
                      `${ROUTE_LINK_CERTIFICATES}/${certificateId}`
                  );
        };

        const onClick = useCallback(() => {
            if (isCertificate) {
                setModalCallback(
                    ADD_LEVEL_MODAL,
                    (isSuccess, data: Certificate) => {
                        isSuccess &&
                            history.replace(
                                `${ROUTE_LINK_CERTIFICATES}/level/${data?._id}`
                            );
                    }
                );
                openModal(ADD_LEVEL_MODAL, {
                    item: {
                        id: id,
                        defaultNumber: levels?.items?.length
                            ? levels?.items?.length + 1
                            : 1
                    }
                });
            } else {
                setModalCallback(BLOCK_EDIT_MODAL, () => {
                    history.replace(ROUTE_LINK_CERTIFICATES);
                });
                openModal(BLOCK_EDIT_MODAL, {
                    item: {
                        id: id,
                        defaultNumber: blocks?.items?.length
                            ? blocks?.items?.length + 1
                            : 1
                    }
                });
            }
        }, [
            isCertificate,
            id,
            openModal,
            setModalCallback,
            history,
            levels,
            blocks
        ]);

        return (
            <PageHeader
                afterTitle={
                    <Status
                        status={isCertificate 
                            ? getStatus(certificate?.status)
                            : getStatus(level?.status)
                        }
                        className="ml-5"
                        text={isCertificate 
                            ? getStatusTitle(t, certificate?.status)
                            : getStatusTitle(t, level?.status)
                    }
                />
                }
                onBack={goBack}
                title={
                    isCertificate
                        ? t("certificate.certificateTitle", {
                              country: certificate?.country?.name
                          })
                        : t("certificate.levelTitle", { name: level?.name })
                }
            >
                {isCertificate ? (
                    <>
                        <Button
                            htmlType="button"
                            text={t("add")}
                            onClick={onClick}
                        />
                        <PoppedEditButton id={id} />
                    </>
                ) : (
                    <>
                        <PoppedCreateButton />
                        <PoppedEditButtonLevel id={id} />
                    </>
                )}
            </PageHeader>
        );
    }
);
