import { PriceType } from "./../../types";
import { Gift } from "../../types";

export const transformToPriceObject = (data: Gift) => {
    return {
        value: data.pricePoints,
        currency: "points" as "points"
    };
};

export const transformFromPriceObject = (obj: PriceType): number => {
    return obj && obj.value ? obj.value : 0;
};
