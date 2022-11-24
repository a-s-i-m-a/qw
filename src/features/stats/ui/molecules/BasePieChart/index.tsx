import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Cell, Legend, Pie, PieChart, Tooltip, TooltipProps } from "recharts";
import { Currency, PieChartData } from "../../../../types";
import { CustomTooltip } from "./CustomTooltip";
import { renderLegend } from "./Legend";

interface PieChartProps {
    currency: Currency;
    data: PieChartData[];
    isOrder: boolean;
}

export const BasePieChart: FC<PieChartProps> = ({
    currency,
    data,
    isOrder
}) => {
    const COLORS =
        data?.length > 0 && data[0].percent !== 0
            ? ["#B88BDA", "#FFDE76", "#90D0B2", "#9EB4EC", "#F0A469", "#E287C9"]
            : ["#C5C5D6"];
    const { t } = useTranslation();
    const noData = [{ name: t("stats.noData"), percent: 10000 }];
    const sortedData = useMemo(
        () => data.sort((a, b) => b.percent - a.percent),
        [data]
    );

    return (
        <PieChart width={660} height={265}>
            <Pie
                data={
                    data?.length > 0 && data[0].percent !== 0
                        ? sortedData
                        : noData
                }
                dataKey="percent"
                innerRadius={60}
                outerRadius={115}
                cx={140}
                startAngle={90}
                endAngle={-450}
                minAngle={3}
            >
                {data?.length > 0 && data[0].percent !== 0
                    ? sortedData.map((entry, index) => {
                          return (
                              <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                  stroke={COLORS[index % COLORS.length]}
                              />
                          );
                      })
                    : noData.map((entry, index) => {
                          return (
                              <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                  stroke={COLORS[index % COLORS.length]}
                              />
                          );
                      })}
            </Pie>
            <Legend
                content={props => renderLegend({ props, data })}
                layout="vertical"
                align="right"
                verticalAlign="middle"
            />
            {data?.length && (
                <Tooltip
                    content={(props: TooltipProps<number, string>) => (
                        <CustomTooltip
                            props={props}
                            isOrder={isOrder}
                            currency={currency}
                        />
                    )}
                />
            )}
        </PieChart>
    );
};
