import React, { FC } from "react";
import { MinusIcon, PlusIcon } from "../Icon";

import "./rangeInput.css";

interface RangeInputProps {
    disabled: boolean;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onMinusClick: () => void;
    onPlusClick: () => void;
}

export const RangeInput: FC<RangeInputProps> = ({
    disabled,
    max,
    min,
    step,
    value,
    onChange,
    onMinusClick,
    onPlusClick
}) => {
    return (
        <span
            className={`flex flex-row items-center mt-26p mb-8 ${
                disabled ? "text-gray-main" : "text-dark-main"
            }`}
        >
            <button
                className="w-4 h-4 focus:outline-none"
                disabled={disabled}
                type="button"
                onClick={onMinusClick}
            >
                <MinusIcon />
            </button>
            <div className="flex justify-center px-4">
                <input
                    type="range"
                    className={`appearance-none w-138p h-0.5 bg-gray-light rounded-sm outline-none ${
                        disabled ? "slider-thumb disabled" : "slider-thumb"
                    }`}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={e => onChange(e)}
                    disabled={disabled}
                />
            </div>
            <button
                className="w-4 h-4 focus:outline-none"
                type="button"
                disabled={disabled}
                onClick={onPlusClick}
            >
                <PlusIcon />
            </button>
        </span>
    );
};
