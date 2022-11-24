import { TFunction } from "i18next";
import { OrderStatus } from "../../types";

export const getStatus = (status: OrderStatus) => {
    if (status === "new") {
        return "purple";
    }
    if (status === "processing") {
        return "neutral";
    }
    if (status === "sent") {
        return "blue";
    }
    if (status === "completed") {
        return "success";
    }
    return "danger";
};

export const getStatusText = (status: OrderStatus, t: TFunction) => {
    if (status === "new") {
        return t("orders.status.new");
    }
    if (status === "processing") {
        return t("orders.status.processing");
    }
    if (status === "sent") {
        return t("orders.status.sent");
    }
    if (status === "completed") {
        return t("orders.status.completed");
    }
    return t("orders.status.cancelled");
};

export const getSearchStatus = (tab: number) => {
    if (tab === 0) {
        return "new";
    }
    if (tab === 1) {
        return "processing";
    }
    if (tab === 2) {
        return "sent";
    }
    if (tab === 3) {
        return "completed";
    }
    if (tab === 4) {
        return "cancelled";
    }
    return undefined;
};
