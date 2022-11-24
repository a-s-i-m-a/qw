import React, { FC } from "react";

interface PieTooltipHeaderProps {
    color: string;
    name: string;
    value: string | null;
}

export const PieTooltipHeader: FC<PieTooltipHeaderProps> = ({
    color,
    name,
    value
}) => {
    return (
        <span className="flex flex-row items-center mb-10p">
            <div className="w-3 mr-8p">
                <div
                    className="w-2 h-2 border-0 rounded-full"
                    style={{ backgroundColor: color }}
                />
            </div>
            <div className="flex flex-row justify-between w-full">
                <p className="w-150p truncate">{name}</p>
                <p>{value}</p>
            </div>
        </span>
    );
};
