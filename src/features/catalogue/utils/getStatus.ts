import { Product } from "../../types";

export const getStatus = (product: Product): "neutral" | "success" | "danger" => {
    if (product.isDeleted) {
        return "danger";
    }
    if (product.isAvailableForSale) {
        return "success";
    } else {
        return "neutral";
    }
};
