import { Dayjs } from "dayjs";
import React, { FC, useState } from "react";
import { useClickOutside } from "../../../features/utils/hooks/useClickOutside";
import { Button } from "../../atoms/Button";
import { Calendar } from "../Calendar";
import { getFormattedDate } from "../Calendar/dateUtils";
import { Popper } from "./Popper";
import { RangeInputs } from "./RangeInputs";

interface DateRangePickerProps {
    startRange: string;
    endRange: string;
    isWeekStartWithSunday?: boolean;
    startInputValue: string;
    endInputValue: string;
    startInputError: boolean;
    endInputError: boolean;
    visible: boolean;
    setVisible: (status: boolean) => void;
    onDayClick: (day: Dayjs) => void;
    onMouseEnter: (day: Dayjs) => void;
    onEndInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onStartInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onInputsSubmit: () => void;
    setStartError: (status: boolean) => void;
    setEndError: (status: boolean) => void;
}

export const DateRangePicker: FC<DateRangePickerProps> = ({
    startRange,
    endRange,
    isWeekStartWithSunday,
    startInputValue,
    endInputValue,
    startInputError,
    endInputError,
    visible,
    setVisible,
    onDayClick,
    onMouseEnter,
    onEndInputChange,
    onStartInputChange,
    onInputsSubmit,
    setEndError,
    setStartError
}) => {
    const [referenceElement, setReference] = useState<HTMLDivElement | null>(
        null
    );
    const onOutside = () => {
        setVisible(false);
        setEndError(false);
        setStartError(false);
    };
    useClickOutside(
        { current: referenceElement },
        onOutside,
        document.getElementById("root")!
    );
    return (
        <div>
            <div ref={setReference} onClick={() => setVisible(!visible)}>
                <Button
                    text={`${getFormattedDate(endRange)} - ${getFormattedDate(
                        startRange
                    )}`}
                    type="range-picker"
                    isActive={visible}
                    className="h-42p"
                />
            </div>
            {visible && (
                <Popper referenceElement={referenceElement} offset={8}>
                    <Calendar
                        startRange={startRange}
                        endRange={endRange}
                        onDayClick={onDayClick}
                        onMouseEnter={onMouseEnter}
                        isWeekStartWithSunday={isWeekStartWithSunday}
                    />
                    <RangeInputs
                        startInputValue={startInputValue}
                        endInputValue={endInputValue}
                        startInputError={startInputError}
                        endInputError={endInputError}
                        onEndInputChange={onEndInputChange}
                        onStartInputChange={onStartInputChange}
                        onInputsSubmit={onInputsSubmit}
                    />
                </Popper>
            )}
        </div>
    );
};
