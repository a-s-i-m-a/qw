import React, { FC } from "react";
import { getFormattedDate } from "../../../../../ui/organisms/Calendar/dateUtils";

interface XAxisProps {
    startDate?: string;
    endDate?: string;
}

export const XAxisLabel: FC<XAxisProps> = ({ startDate, endDate }) => {
    return (
        <g>
            <foreignObject x={5} y={245} width={100} height={20}>
                <div className="text-12 text-gray-text font-semibold bg-gray-bg">
                    {startDate && getFormattedDate(startDate)}
                </div>
            </foreignObject>
            <foreignObject x={595} y={245} width={100} height={20}>
                <div className="text-12 text-gray-text font-semibold bg-gray-bg">
                    {endDate && getFormattedDate(endDate)}
                </div>
            </foreignObject>
        </g>
    );
};
