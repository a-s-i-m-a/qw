import React, { FC } from "react";

interface ChartTooltipDataProps {
    title: string;
    value: string;
}

export const ChartTooltipData: FC<ChartTooltipDataProps> = ({
    title,
    value
}) => {
    return (
        <span className="flex justify-between text-dark-text">
            <p className="w-150p truncate">{title}</p>
            <p className="font-semibold">{value}</p>
        </span>
    );
};
