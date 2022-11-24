import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { throwSuccessToast } from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { Salepoint } from "../../../../types";
import { SalepointsAPI } from "../../../../utils/api/requests/salepoints-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";

interface DeleteModalProps {
    id: string;
}

export const DELETE_SALEPOINT_MODAL = "DELETE_SALEPOINT_MODAL";

export const DeleteSalepointModal: FC<DeleteModalProps> = observer(({ id }) => {
    const { t } = useTranslation();
    const {
        register,
        closeModal,
        activeModalId,
        modalData,
        modalCallback
    } = useModal<{
        item: Salepoint;
    }>();

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    const { mutate, isLoading } = useMutation({
        fetchFn: SalepointsAPI.removeSalepoint,
        onSuccess: data => {
            closeModal();

            throwSuccessToast(t("salepoints.salepointHasDeleted"));
            const cb = modalCallback[DELETE_SALEPOINT_MODAL];
            cb && cb(true, data);
        }
    });

    const onDelete = () => {
        if (modalData?.item._id) {
            mutate({ id: modalData!?.item?._id });
        }
    };

    if (activeModalId !== id) return null;

    return (
        <section className="w-600p bg-white rounded-20p flex flex-col text-dark-main">
            <h4 className="text-18 font-semibold p-6">
                {t("salepoints.sureToDeleteSalepoint")}
            </h4>
            <span className="text-14 leading-5 mb-16 px-6">
                {t("salepoints.sureToDeleteSalepointDescription")}
            </span>

            <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                <Button
                    text={t("cancel_2")}
                    onClick={closeModal}
                    className="mr-10p"
                />
                <Button
                    text={t("salepoints.yesDeleteSalepoint")}
                    onClick={onDelete}
                    type="tertiary"
                    isDisabled={isLoading}
                />
            </div>
        </section>
    );
});
