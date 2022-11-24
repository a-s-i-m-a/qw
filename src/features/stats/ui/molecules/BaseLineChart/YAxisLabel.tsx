import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Currency } from "../../../../types";
import { ChartAccessor } from "../../../types";
import { getYAxisLabel } from "../../../utils/chartsHelper";

interface YAxisProps {
    maxValue: number;
    currency: Currency;
    accessor: ChartAccessor;
}

export const YAxisLabel: FC<YAxisProps> = ({
    maxValue,
    currency,
    accessor
}) => {
    const { t } = useTranslation();
    return (
        <g>
            <foreignObject x={0} y={-8} width={400} height={20}>
                <div className="inline-block pr-10p text-12 text-dark-text font-semibold bg-gray-bg">
                    {getYAxisLabel(maxValue, currency, t, accessor)}
                </div>
            </foreignObject>
            <foreignObject x={0} y={104} width={400} height={20}>
                <div className="inline-block pr-10p text-12 text-dark-text font-semibold bg-gray-bg">
                    {getYAxisLabel(maxValue / 2, currency, t, accessor)}
                </div>
            </foreignObject>
        </g>
    );
};
