import { TFunction } from "i18next";
import { Product } from "../../types";

export const getStatusText = (product: Product, t: TFunction): string => {
    if (product.isDeleted) {
        return t("removed");
    }
    if (product.isAvailableForSale) {
        return t("onSale");
    } else {
        return t("notOnTheShowCase");
    }
};
