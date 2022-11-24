import { FC } from "react";
import { useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Accordion } from "./Accordion";

interface BonusMultiplyingProps {
    isEditing: boolean;
    hideDisabled?: boolean;
    hideToggle?: boolean;
}
export const BonusMultiplying: FC<BonusMultiplyingProps> = ({
    isEditing,
    hideDisabled = true,
    hideToggle
}) => {
    const { t } = useTranslation();
    const {
        field: { value, onChange }
    } = useController({
        name: "bonusInstrument.isEnabled"
    });
    if (!isEditing && value === false && hideDisabled) {
        return null;
    }

    return (
        <Accordion
            value={value}
            onChange={onChange}
            title={t("promotionFeatures.multiplyScoresForPurchase")}
            description={t("promotionFeatures.multiplyScoresForPurchaseMsg")}
            className="mb-20p"
            isEditing={isEditing}
            hideToggle={hideToggle}
        />
    );
};
