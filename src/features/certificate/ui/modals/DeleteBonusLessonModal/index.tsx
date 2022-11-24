import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../../../../../ui/atoms/Button";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { BonusLesson } from "../../../../types";
import { CertificatesAPI } from "../../../../utils/api/requests/certificates-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";
import { certificatesStore } from "../../../store/CertificatesStore";
import { transformBonusLesson } from "../../../utils/transform";

interface DeleteModalProps {
    id: string;
}

export const DELETE_BONUSLESSON_MODAL = "DELETE_BONUSLESSON_MODAL";

export const DeleteBonusLessonModal: FC<DeleteModalProps> = observer(
    ({ id }) => {
        const { t } = useTranslation();
        const { level } = useContext(certificatesStore);
        const {
            register,
            closeModal,
            activeModalId,
            modalData,
            modalCallback
        } = useModal<{
            item: BonusLesson;
        }>();

        useEffect(() => {
            register({
                id
            });
        }, [id, register]);

        const { mutate, isLoading } = useMutation({
            fetchFn: CertificatesAPI.updateLevel,
            onSuccess: data => {
                closeModal();

                throwSuccessToast(t("videoHasDeleted"));
                const cb = modalCallback[DELETE_BONUSLESSON_MODAL];
                cb && cb(true, data);
            },
            onError: () => throwErrorToast(t("error"), t("unknownError"))
        });

        const onDelete = () => {
            if (modalData?.item?._id) {
                mutate({
                    id: level?._id,
                    formData: {
                        ...level,
                        bonusLessons: transformBonusLesson(
                            level?.bonusLessons.filter(
                                item => item._id !== modalData?.item?._id
                            )
                        )
                    }
                });
            }
        };

        if (activeModalId !== id) return null;

        return (
            <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
                <h4 className="text-18 font-semibold p-6">
                    {t("certificate.sureToDeleteBonusVideo")}
                </h4>
                <span className="text-14 leading-5 mb-16 px-6">
                    {t("certificate.sureToDeleteBonusVideoDescr")}
                </span>

                <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                    <Button
                        text={t("cancel_2")}
                        onClick={closeModal}
                        className="mr-10p"
                    />
                    <Button
                        text={t("deleteConfirm")}
                        onClick={onDelete}
                        type="tertiary"
                        isDisabled={isLoading}
                    />
                </div>
            </section>
        );
    }
);
