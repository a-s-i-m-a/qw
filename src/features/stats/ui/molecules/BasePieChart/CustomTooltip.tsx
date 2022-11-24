import { useTranslation } from "react-i18next";
import { TooltipProps } from "recharts";
import { Currency } from "../../../../types";
import { formatThousandsSpaces } from "../../../../utils/formatNumber";
import { getSuffix } from "../../../../utils/getSuffix";
import { ChartTooltipData } from "../../atoms/ChartTooltipData";
import { PieTooltipHeader } from "../../atoms/PieTooltipHeader";

export const CustomTooltip = ({
    props,
    isOrder,
    currency
}: {
    props: TooltipProps<number, string>;
    isOrder: boolean;
    currency: Currency;
}) => {
    const { t } = useTranslation();
    const { active, payload } = props;
    if (active && payload && payload.length) {
        return (
            <div className="shadow-dropdown flex flex-col border-0 rounded-14p bg-white p-20p text-12 w-277p">
                <PieTooltipHeader
                    color={payload[0].payload.fill}
                    name={payload[0]?.payload?.name ?? "—"}
                    value={
                        payload[0].value ? `${payload[0].value / 100}%` : null
                    }
                />
                <ChartTooltipData
                    title={
                        isOrder
                            ? t("stats.quantity")
                            : t("stats.complitedOrders")
                    }
                    value={t("stats.pcs", {
                        count: payload[0]?.payload?.count ?? 0
                    })}
                />
                <ChartTooltipData
                    title={t("stats.sum")}
                    value={`${formatThousandsSpaces(payload[0]?.payload?.total ?? 0)} ${getSuffix(
                        currency
                    )}`}
                />
            </div>
        );
    }
    return null;
};
