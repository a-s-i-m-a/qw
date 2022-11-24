import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { TooltipProps } from "recharts";
import { serverDateMask } from "../../../../../ui/organisms/Calendar/dateUtils";
import { Currency } from "../../../../types";
import { getSuffix } from "../../../../utils/getSuffix";
import { ChartAccessor } from "../../../types";
import { getSumData } from "../../../utils/chartsHelper";
import { ChartTooltipData } from "../../atoms/ChartTooltipData";

export const CustomTooltip = ({
    props,
    isOrder,
    accessor,
    currency
}: {
    props: TooltipProps<number, string>;
    isOrder: boolean;
    accessor: ChartAccessor;
    currency: Currency;
}) => {
    const { t, i18n } = useTranslation();
    const { active, payload } = props;
    if (active && payload && payload.length) {
        return (
            <div className="shadow-dropdown flex flex-col border-0 rounded-14p bg-white p-20p text-12 w-277p">
                <p className="text-gray-text">
                    {dayjs(payload[0]?.payload?.date, serverDateMask)
                        .locale(i18n.language)
                        .format("DD.MM.YYYY, dddd")}
                </p>
                <ChartTooltipData
                    title={
                        isOrder
                            ? t("stats.quantity")
                            : t("stats.complitedOrders")
                    }
                    value={t("stats.pcs", {
                        count:
                            accessor !== "cancelledOrderCount"
                                ? payload[0]?.payload?.completedOrderCount ?? 0
                                : payload[0]?.payload?.cancelledOrderCount ?? 0
                    })}
                />
                <ChartTooltipData
                    title={t("stats.sum")}
                    value={`${getSumData(accessor, payload[0].payload)} 
                      ${getSuffix(currency)}`}
                />
            </div>
        );
    }
    return null;
};
