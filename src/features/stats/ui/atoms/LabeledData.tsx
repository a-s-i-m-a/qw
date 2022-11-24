import React, { FC } from "react";

interface LabeledDataProps {
    label: string;
    value: string;
}

export const LabeledData: FC<LabeledDataProps> = ({ label, value }) => {
    return (
        <label>
            <div className="text-14 text-gray-text font-semibold mb-3 pr-1">
                {label}
            </div>
            <span className="text-24 font-semibold text-base text-dark-main">
                {value}
            </span>
        </label>
    );
};
