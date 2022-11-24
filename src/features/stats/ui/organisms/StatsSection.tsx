import { observer } from "mobx-react-lite";
import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Currency } from "../../../types";
import { formatThousandsSpaces } from "../../../utils/formatNumber";
import { getSuffix } from "../../../utils/getSuffix";
import { statsStore } from "../../store/StatsStore";
import { LabeledData } from "../atoms/LabeledData";

interface StatsSectionProps {
    currency: Currency;
}

export const StatsSection: FC<StatsSectionProps> = observer(({ currency }) => {
    const { t } = useTranslation();
    const { graphData } = useContext(statsStore);
    return (
        <section className="grid grid-cols-2 gap-x-30p gap-y-30p mt-40p border-0 bg-gray-bg rounded-20p p-30p">
            <LabeledData
                label={t("stats.salesAmount")}
                value={`${formatThousandsSpaces(graphData?.sellsTotal || 0)} ${getSuffix(currency)}`}
            />
            <LabeledData
                label={t("stats.platformCommission")}
                value={`${formatThousandsSpaces(graphData?.commissionTotal || 0)} ${getSuffix(currency)}`}
            />
            <LabeledData
                label={t("stats.complitedOrders")}
                value={t("stats.pcs", {
                    count: graphData?.completedOrderCount
                })}
            />
            <LabeledData
                label={t("stats.cancelledOrders")}
                value={t("stats.pcs", {
                    count: graphData?.cancelledOrderCount
                })}
            />
        </section>
    );
});
