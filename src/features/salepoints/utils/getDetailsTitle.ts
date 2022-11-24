import { TFunction } from "i18next";
import { Salepoint } from "./../../types";

export const getDetailsTitle = (
    salepoint: Salepoint | null,
    isEditing: boolean,
    isCreating: boolean,
    t: TFunction
) => {
    if (isCreating) {
        return t("salepoints.newSalepoint");
    }
    if (isEditing) {
        return t("salepoints.editSalepoint");
    }
    return salepoint?.location.address ?? "—";
};
