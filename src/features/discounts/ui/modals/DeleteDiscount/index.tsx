import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { throwSuccessToast } from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { Discounts } from "../../../../types";
import { DiscountsAPI } from "../../../../utils/api/requests/discounts-requests";
import { useMutation } from "../../../../utils/hooks/useMutation";

interface DeleteModalProps {
    id: string;
}

export const DELETE_DISCOUNT_MODAL = "DELETE_DISCOUNT_MODAL";

export const DeleteDiscountModal: FC<DeleteModalProps> = observer(({ id }) => {
    const { t } = useTranslation();
    const {
        register,
        closeModal,
        activeModalId,
        modalData,
        modalCallback
    } = useModal<{
        item: Discounts;
    }>();

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    const { mutate, isLoading } = useMutation({
        fetchFn: DiscountsAPI.removeDiscount,
        onSuccess: data => {
            closeModal();

            throwSuccessToast(t("discounts.deleteTitle"));
            const cb = modalCallback[DELETE_DISCOUNT_MODAL];
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
                {t("discounts.sureToDeleteDiscount")}
            </h4>
            <span className="text-14 leading-5 mb-16 px-6">
                {t("discounts.sureToDeleteDiscountDescr")}
            </span>

            <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                <Button
                    text={t("cancel_2")}
                    onClick={closeModal}
                    className="mr-10p"
                />
                <Button
                    text={t("discounts.yesDeleteDiscount")}
                    onClick={onDelete}
                    type="tertiary"
                    isDisabled={isLoading}
                />
            </div>
        </section>
    );
});
