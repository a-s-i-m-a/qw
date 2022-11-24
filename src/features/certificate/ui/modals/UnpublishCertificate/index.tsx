import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { Certificate } from "../../../../types";
import { CertificatesAPI } from "../../../../utils/api/requests/certificates-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";

interface UnpublishModalProps {
    id: string;
}

export const UNPUBLISH_CERTIFICATE_MODAL = "UNPUBLISH_CERTIFICATE_MODAL";

export const UnpublishCertificateModal: FC<UnpublishModalProps> = observer(
    ({ id }) => {
        const { t } = useTranslation();
        const {
            register,
            closeModal,
            activeModalId,
            modalData,
            modalCallback
        } = useModal<{
            item: Certificate;
        }>();

        useEffect(() => {
            register({
                id
            });
        }, [id, register]);

        const { mutate, isLoading } = useMutation({
            fetchFn: CertificatesAPI.changeCertificateStatus,
            onSuccess: data => {
                closeModal();

                throwSuccessToast(t("certificate.certificateUnpublished"));
                const cb = modalCallback[UNPUBLISH_CERTIFICATE_MODAL];
                cb && cb(true, data);
            },
            onError: () => throwErrorToast(t("error"), t("unknownError"))
        });

        const onDelete = () => {
            if (modalData?.item._id) {
                mutate({
                    id: modalData!?.item?._id,
                    status: "pending"
                });
            }
        };

        if (activeModalId !== id) return null;

        return (
            <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
                <h4 className="text-18 font-semibold p-6">
                    {t("certificate.sureUnpublishCertificate")}
                </h4>
                <span className="text-14 leading-5 mb-16 px-6">
                    {t("certificate.sureUnpublishCertificateDescr")}
                </span>

                <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                    <Button
                        text={t("cancel_2")}
                        onClick={closeModal}
                        className="mr-10p"
                    />
                    <Button
                        text={t("certificate.yesUnpublish")}
                        onClick={onDelete}
                        type="tertiary"
                        isDisabled={isLoading}
                    />
                </div>
            </section>
        );
    }
);
