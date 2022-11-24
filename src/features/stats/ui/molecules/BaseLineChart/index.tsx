import { FC } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    TooltipProps
} from "recharts";
import { Currency, Timeline } from "../../../../types";
import { ChartAccessor } from "../../../types";
import { TabOptions } from "../SelectPeriodTabs/TabList";
import { CustomTooltip } from "./CustomTooltip";
import { XAxisLabel } from "./XAxisLabel";
import { YAxisLabel } from "./YAxisLabel";

import "./lineChart.css";

interface LineChartProps {
    period?: TabOptions;
    currency: Currency;
    data: Timeline[];
    accessor: ChartAccessor;
    isOrder: boolean;
}

export const BaseLineChart: FC<LineChartProps> = ({
    period,
    currency,
    data,
    accessor,
    isOrder
}) => {
    const max = Math.max.apply(
        Math,
        data.map(obj => obj[accessor])
    );
    const gridPoints = [
        5,
        27.6,
        50.2,
        72.8,
        95.4,
        118,
        140.6,
        163.2,
        185.8,
        208.4,
        230
    ];
    return (
        <ResponsiveContainer width="100%" height={265}>
            <LineChart width={660} height={265} data={data}>
                <CartesianGrid
                    stroke="#E5E5F2"
                    vertical={false}
                    horizontalPoints={gridPoints}
                />
                <XAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey="name"
                    tick={
                        <XAxisLabel
                            startDate={period?.value[0]}
                            endDate={period?.value[1]}
                        />
                    }
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey={accessor}
                    mirror={true}
                    tick={
                        <YAxisLabel
                            maxValue={max}
                            currency={currency}
                            accessor={accessor}
                        />
                    }
                />
                <Line
                    type="monotone"
                    dataKey={accessor}
                    stroke="#B381D9"
                    strokeWidth={2}
                    dot={false}
                />
                <Tooltip
                    cursor={{ strokeDasharray: "5 5" }}
                    content={(props: TooltipProps<number, string>) => (
                        <CustomTooltip
                            props={props}
                            isOrder={isOrder}
                            accessor={accessor}
                            currency={currency}
                        />
                    )}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};
