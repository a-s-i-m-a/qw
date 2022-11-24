import { TFunction } from "i18next";
import { Discounts } from "./../../types";

export const getDetailsTitle = (
    discount: Discounts | null,
    isEditing: boolean,
    isCreating: boolean,
    t: TFunction
) => {
    if (isCreating) {
        return t("discounts.newDiscount");
    }
    if (isEditing) {
        return t("discounts.editDiscount");
    }
    return discount?.name ?? "—";
};
