import { PriceType } from "../types";

const suffix: Record<PriceType["currency"], string> = {
    rub: "₽",
    usd: "$",
    eur: "€",
    points: ""
};
export const getSuffix = (currency: PriceType["currency"]): string =>
    suffix[currency];
