import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../ui/atoms/Button";
import { throwSuccessToast } from "../../../../../ui/organisms/Toaster";
import { useModal } from "../../../../modalpage/hooks";
import { Gift } from "../../../../types";
import { GiftAPI } from "../../../../utils/api/requests/gift-request";
import { useMutation } from "../../../../utils/hooks/useMutation";

interface DeleteModalProps {
    id: string;
}

export const DELETE_GIFT_MODAL = "DELETE_GIFT_MODAL";

export const DeleteGiftModal: FC<DeleteModalProps> = observer(({ id }) => {
    const { t } = useTranslation();
    const {
        register,
        closeModal,
        activeModalId,
        modalData,
        modalCallback
    } = useModal<{
        item: Gift;
    }>();

    useEffect(() => {
        register({
            id
        });
    }, [id, register]);

    const { mutate, isLoading } = useMutation({
        fetchFn: GiftAPI.removeGift,
        onSuccess: data => {
            closeModal();

            throwSuccessToast(
                t("hasDeleted", {
                    word: t("gift.plural_0")
                })
            );
            const cb = modalCallback[DELETE_GIFT_MODAL];
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
                {t("gift.sureToDeleteGift")}
            </h4>
            <span className="text-14 leading-5 mb-16 px-6">
                {t("gift.sureToDeleteGiftDescription")}
            </span>

            <div className="w-full bg-gray-bg p-6 flex rounded-b-20p">
                <Button
                    text={t("cancel_2")}
                    onClick={closeModal}
                    className="mr-10p"
                />
                <Button
                    text={t("gift.yesDeleteGift")}
                    onClick={onDelete}
                    type="tertiary"
                    isDisabled={isLoading}
                />
            </div>
        </section>
    );
});
