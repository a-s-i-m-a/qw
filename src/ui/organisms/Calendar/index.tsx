import dayjs, { Dayjs } from "dayjs";
import { FC, useState } from "react";
import { CalendarGrid } from "./CalendarGrid";
import { getEndDate, getStartDate, serverDateMask } from "./dateUtils";
import { Header } from "./Header";

interface CalendarProps {
    startRange?: string;
    endRange?: string;
    isWeekStartWithSunday?: boolean;
    onDayClick: (day: Dayjs) => void;
    onMouseEnter: (day: Dayjs) => void;
}

export const Calendar: FC<CalendarProps> = ({
    startRange,
    endRange,
    onDayClick,
    onMouseEnter,
    isWeekStartWithSunday = false
}) => {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const startDay = getStartDate(currentDate, isWeekStartWithSunday);
    const endDay = getEndDate(currentDate, isWeekStartWithSunday);
    const startRangeDate = dayjs(startRange, serverDateMask);
    const endRangeDate = dayjs(endRange, serverDateMask);

    const onPrevMonth = () => {
        setCurrentDate(prev => prev.add(-1, "month"));
    };
    const onNextMonth = () => {
        setCurrentDate(prev => prev.add(1, "month"));
    };
    return (
        <section className="px-20p flex flex-col w-285p mt-25p">
            <Header
                currentDay={currentDate}
                onPrevMonth={onPrevMonth}
                onNextMonth={onNextMonth}
            />
            <CalendarGrid
                startDay={startDay}
                endDay={endDay}
                currentDate={currentDate}
                startRange={startRangeDate}
                endRange={endRangeDate}
                onDayClick={onDayClick}
                onMouseEnter={onMouseEnter}
                isWeekStartWithSunday={isWeekStartWithSunday}
            />
        </section>
    );
};
