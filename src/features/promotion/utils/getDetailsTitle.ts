import { TFunction } from "i18next";
import { Promo } from "../../types";

export const getDetailsTitle = (
    promo: Promo | null,
    isCreating: boolean,
    t: TFunction
) => {
    if (isCreating) {
        return t(`promoRequest`);
    }

    return promo?.product?.name ?? "—";
};
