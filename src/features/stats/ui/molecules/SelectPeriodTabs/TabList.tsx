import React, { FC, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { DateRangePicker } from "../../../../../ui/organisms/DateRangePicker";
import { usePicker } from "../../../../../ui/organisms/DateRangePicker/usePicker";

export interface TabOptions<icon extends boolean = false> {
    value: icon extends true ? string : string[];
    label: string;
}
interface TabListProps<DType extends TabOptions = TabOptions> {
    options: DType[];
    value: TabOptions;
    onChange: (value: TabOptions) => void;
    className?: string;
}

export const TabList: FC<TabListProps> = ({
    options,
    onChange,
    value,
    className = ""
}) => {
    const handleOnChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (event.currentTarget?.dataset?.tab) {
            const selectedTab = event.currentTarget?.dataset?.tab;

            const option = options.find(
                option => option.value.join(",") === selectedTab
            );
            onChange(option!);
        }
    };
    const range = useWatch({
        name: "period"
    });
    const defaultRange = useMemo(() => [range?.value[0], range?.value[1]], [
        range
    ]);
    const pickerMethods = usePicker({ defaultRange });
    return (
        <section className={`w-720p flex flex-row justify-between ${className}`}>
            {options.map(tab => (
                <button
                    type="submit"
                    key={tab.label}
                    data-tab={tab.value}
                    onClick={handleOnChange}
                    className={`h-42p flex border-gray-bg transition-colors duration-300 
                    border-2 py-10p rounded-10p px-4 shadow-none focus:outline-none 
                    text-base text-dark-main font-semibold whitespace-nowrap items-center
                    ${
                        value?.label !== tab.label
                            ? "bg-gray-bg hover:bg-white"
                            : "bg-white"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
            <DateRangePicker {...pickerMethods} />
        </section>
    );
};
