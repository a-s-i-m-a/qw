import { Timeline } from "./../../types";
import { TFunction } from "react-i18next";
import { Currency } from "../../types";
import { getSuffix } from "../../utils/getSuffix";
import { ChartAccessor } from "../types";
import { formatThousandsSpaces } from "../../utils/formatNumber";

export const getYAxisLabel = (
    value: number,
    currency: Currency,
    t: TFunction,
    accessor: ChartAccessor
) => {
    if (accessor === "sellsTotal") {
        return `${formatThousandsSpaces(value)} ${getSuffix(currency)}`;
    }
    if (accessor === "commissionTotal") {
        return `${formatThousandsSpaces(value)} ${getSuffix(currency)}`;
    }
    if (accessor === "completedOrderCount") {
        return t("stats.pcs", { count: value ?? 0 });
    }
    return t("stats.pcs", { count: value ?? 0 });
};

export const getSumData = (accessor: ChartAccessor, payload: Timeline) => {
    if (accessor === "sellsTotal" || accessor === "commissionTotal") {
        return formatThousandsSpaces(payload[accessor] ?? 0);
    }
    if (accessor === "cancelledOrderCount") {
        return formatThousandsSpaces(payload?.cancelledSellsTotal ?? 0);
    }
    return formatThousandsSpaces(payload?.sellsTotal ?? 0);
};
