import { TFunction } from "i18next";

export const getStatus = (
    status: "accepted" | "pending",
) => {
    if (status === "accepted") {
        return "success";
    }
        return "neutral";
};

export const getStatusText = (
    status: "accepted" | "pending",
    t: TFunction
) => {
    if (status === "accepted") {
        return t("discounts.statusAccepted");
    }
        return t("discounts.statusPending");
};