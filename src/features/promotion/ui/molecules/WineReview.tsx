import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useCallback, useContext, useEffect } from "react";
import { useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { authStore } from "../../../auth/store/AuthStore";
import { useModal } from "../../../modalpage/hooks";
import { PromosAPI } from "../../../utils/api/requests/promos-requests";
import { useMutation } from "../../../utils/hooks/useMutation";
import { SimpleButton } from "../atoms/SimpleButton";
import { PROMOTION_SET_TASK_MODAL } from "../modals/SetTaskModal";
import { Accordion } from "./Accordion";
import { useWatch } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { ReviewSelect } from "./ReviewSelect";

interface WineReviewProps {
    isEditing: boolean;
    productId?: string;
    hideDisabled?: boolean;
    hideToggle?: boolean;
}

export const WineReview: FC<WineReviewProps> = observer(
    ({ isEditing, productId, hideDisabled = true, hideToggle }) => {
        const { t } = useTranslation();
        const { openModal, setModalCallback } = useModal();
        const { user } = useContext(authStore);
        const history = useHistory();
        const { mutate, data } = useMutation({
            fetchFn: PromosAPI.getTasks
        });
        const fetchCount = useCallback(() => {
            mutate({
                limit: 0,
                status: "pending|completed",
                type: "review",
                productId,
                bypassCancel: true,
                _fields: ""
            });
        }, [mutate, productId]);
        const handleModalOpen = () => {
            setModalCallback(PROMOTION_SET_TASK_MODAL, (flag: boolean) => {
                flag && fetchCount();
            });
            openModal(PROMOTION_SET_TASK_MODAL, {
                type: "review"
            });
        };

        const {
            field: { value, onChange }
        } = useController({
            name: "reviewInstrument.isEnabled"
        });

        useEffect(() => {
            productId && user?.role !== "manufacturer" && fetchCount();
        }, [fetchCount, productId, user?.role]);

        const reviewId = useWatch({ name: "reviewInstrument.reviewId" });
        const openReview = () => {
            history.push(`/reviews/${reviewId.value}`);
        };

        if (!isEditing && value === false && hideDisabled) {
            return null;
        }
        return (
            <Accordion
                value={value}
                onChange={onChange}
                description={t("promotionFeatures.reviewOfProfSommelierMsg")}
                title={t("expertReview")}
                className="mb-20p"
                isEditing={isEditing}
                hideToggle={hideToggle}
                children={
                    !isEditing && reviewId?.value ? (
                        <SimpleButton
                            onClick={openReview}
                            label={t("review.plural_0")}
                            className="mb-10p"
                        />
                    ) : user?.role !== "manufacturer" && isEditing ? (
                        <section className="w-full flex flex-col">
                            <div className="flex mb-1 justify-between items-center font-semibold text-14 text-gray-text">
                                <p>{t("review.plural_0")}</p>
                                <p
                                    className={
                                        data?.totalCount
                                            ? "text-danger"
                                            : undefined
                                    }
                                >{`${t("inWork")}: ${
                                    data?.totalCount ?? 0
                                }`}</p>
                            </div>
                            {productId && (
                                <ReviewSelect
                                    isEditing={isEditing}
                                    productId={productId}
                                />
                            )}
                            <SimpleButton
                                onClick={handleModalOpen}
                                label={t("setTask")}
                            />
                        </section>
                    ) : undefined
                }
            />
        );
    }
);
