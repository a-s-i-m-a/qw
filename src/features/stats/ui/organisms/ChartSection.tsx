import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { TabList } from "../../../../ui/organisms/TabList";
import { Currency, PieChartData } from "../../../types";
import { statsStore } from "../../store/StatsStore";
import { ChartAccessor } from "../../types";
import { ChartTypeBtns } from "../molecules/ChartTypeBtns";
import { BaseLineChart } from "../molecules/BaseLineChart";
import { BasePieChart } from "../molecules/BasePieChart";
import { TabOptions } from "../molecules/SelectPeriodTabs/TabList";

interface ChartSectionProps {
    tabs: string[];
    period?: TabOptions;
    isMultiple?: boolean;
    currency: Currency;
    accessor?: ChartAccessor;
    tab?: number;
    setTab?: (value: number) => void;
    chartType?: number;
    setChartType?: (value: number) => void;
    pieData?: PieChartData[];
}

export const ChartSection: FC<ChartSectionProps> = observer(
    ({
        tabs,
        period,
        isMultiple = true,
        currency,
        tab,
        setTab,
        chartType,
        setChartType,
        accessor,
        pieData
    }) => {
        const { graphData } = useContext(statsStore);
        const isOrder =
            accessor === "completedOrderCount" ||
            accessor === "cancelledOrderCount";
        const onTabChange = (index: number) => {
            setTab && setTab(index);
        };
        const onGrafClick = () => {
            setChartType && setChartType(0);
        };
        const onDiagClick = () => {
            setChartType && setChartType(1);
        };
        return (
            <section className="border-0 bg-gray-bg rounded-20p mt-20p px-30p py-20p bi-avoid">
                <section className="flex flex-row justify-between mb-30p">
                    {tabs.length > 1 && tab !== undefined ? (
                        <TabList
                            activeIndex={tab}
                            onChange={onTabChange}
                            options={tabs}
                        />
                    ) : (
                        <p className="text-16 font-semibold text-base text-dark-main">
                            {tabs[0]}
                        </p>
                    )}
                    {isMultiple && chartType !== undefined && (
                        <ChartTypeBtns
                            selectedChart={chartType}
                            onDiagClick={onDiagClick}
                            onGrafClick={onGrafClick}
                        />
                    )}
                </section>
                {chartType === 0 && tabs.length > 1 && accessor && (
                    <BaseLineChart
                        period={period}
                        currency={currency}
                        data={graphData?.timeline || []}
                        accessor={accessor}
                        isOrder={isOrder}
                    />
                )}
                {(chartType === 1 || !isMultiple) && (
                    <BasePieChart
                        currency={currency}
                        data={pieData ?? []}
                        isOrder={isOrder}
                    />
                )}
            </section>
        );
    }
);
