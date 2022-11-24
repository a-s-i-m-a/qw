import { TFunction } from "i18next";
import { Product } from "../../types";

export const getDetailsTitle = (
    product: Product | null,
    isEditing: boolean,
    isCreating: boolean,
    t: TFunction
) => {
    if (isCreating) {
        return t(`newReview`);
    }
    if (isEditing) {
        return t("editing");
    }
    return product?.name ?? "—";
};
