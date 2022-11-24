import { Order } from "./../../types";
import { TFunction } from "i18next";

export const getDetailsTitle = (
    order: Order<false> | null,
    isEditing: boolean,
    t: TFunction
) => {
    if (isEditing) {
        return t("orders.editingOrder");
    }
    return order?.number
        ? t("orders.orderTitle", { number: order.number })
        : "—";
};
