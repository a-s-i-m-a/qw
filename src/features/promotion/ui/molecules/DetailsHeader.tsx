import { useContext, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { PageHeader } from "../../../../ui/molecules/PageHeader";
import { authStore } from "../../../auth/store/AuthStore";
import { promotionStore } from "../../store/PromotionStore";
import { getDetailsTitle } from "../../utils/getDetailsTitle";
import { PoppedEditButton } from "./PoppedEditButton";

export const DetailsHeader = () => {
    const history = useHistory();
    const isCreating = useRouteMatch("/promotion/create");
    const { isEditing, promo } = useContext(promotionStore);
    const { user } = useContext(authStore);
    const { formState } = useFormContext();
    const { t } = useTranslation();
    const { dirtyFields } = formState;

    const handleBack = () => {
        history.goBack();
    };
    const instruments = useWatch({
        name: [
            "bonusInstrument.isEnabled",
            "discountInstrument.isEnabled",
            "reviewInstrument.isEnabled",
            "videoInstrument.isEnabled"
        ]
    });
    const canSubmit = useMemo(
        () => instruments.reduce((acc, value) => acc || value, false),
        [instruments]
    );
    const canBack = useMemo(
        () =>
            user?.role === "manufacturer"
                ? (isEditing && promo) || promo?._id
                : true,
        [isEditing, promo, user?.role]
    );

    return (
        <PageHeader
            title={getDetailsTitle(promo, !!isCreating, t)}
            onBack={canBack ? handleBack : undefined}
        >
            {user?.role !== "manufacturer" && (
                <Button text={t("confirm")} isDisabled={!canSubmit} />
            )}
            {user?.role === "manufacturer" && !promo && (
                <>
                    <Button
                        text={t("cancel_1")}
                        htmlType="button"
                        onClick={handleBack}
                        type="secondary"
                    />
                    <Button
                        text={t("requestPromotion")}
                        isDisabled={
                            Object.keys(dirtyFields).length === 0 || !canSubmit
                        }
                    />
                </>
            )}
            {promo && <PoppedEditButton id={promo?._id} />}
        </PageHeader>
    );
};
