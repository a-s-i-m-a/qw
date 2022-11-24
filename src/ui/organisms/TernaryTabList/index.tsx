import React, { FC, ReactElement } from "react";
import { ReactText } from "react";
import { Languages } from "../../../features/types";

export interface TabOptions {
    value: Languages;
    label: string;
    Icon: ReactText | ReactElement;
}
interface TernaryTabListProps<DType extends TabOptions = TabOptions> {
    options: DType[];
    value: TabOptions;
    onChange: (value: TabOptions) => void;
    className?: string;
}

export const TernaryTabList: FC<TernaryTabListProps> = ({
    options,
    onChange,
    value,
    className = ""
}) => {
    const handleOnChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (event.currentTarget?.dataset?.tab) {
            const selectedTab = event.currentTarget?.dataset?.tab;
            const option = options.find(option => option.value === selectedTab);
            onChange(option!);
        }
    };
    return (
        <section className={`flex ${className}`}>
            {options.map(tab => (
                <button
                    type="button"
                    key={tab.value}
                    data-tab={tab.value}
                    onClick={handleOnChange}
                    className={`flex border-gray-bg transition-colors duration-300 focus:outline-none
                    border-2 py-10p rounded-10p px-4 shadow-none outline-none mr-4 last:mr-0 
                    text-base text-dark-main font-semibold whitespace-nowrap ${
                        value?.value !== tab.value
                            ? "bg-gray-bg hover:bg-white"
                            : "bg-white"
                    }`}
                >
                    <span className="mr-10p">{tab.Icon}</span> {tab.label}
                </button>
            ))}
        </section>
    );
};
