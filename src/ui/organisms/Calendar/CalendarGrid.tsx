import dayjs, { Dayjs } from "dayjs";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { getMonthData, isInRange } from "./dateUtils";
import { Day } from "./Day";
import "dayjs/locale/ru";
import "dayjs/locale/en";
import "dayjs/locale/it";

interface CalendarGridProps {
    startDay: Dayjs;
    endDay: Dayjs;
    currentDate: Dayjs;
    startRange: Dayjs;
    endRange: Dayjs;
    isWeekStartWithSunday: boolean;
    onDayClick: (day: Dayjs) => void;
    onMouseEnter: (day: Dayjs) => void;
}

export const CalendarGrid: FC<CalendarGridProps> = ({
    startDay,
    endDay,
    currentDate,
    startRange,
    endRange,
    isWeekStartWithSunday,
    onDayClick,
    onMouseEnter
}) => {
    const { i18n } = useTranslation();

    return (
        <div className="grid grid-cols-7">
            {[...Array(7)].map((_, index) => (
                <span className="w-35p flex justify-center" key={index}>
                    <p className="text-12 text-gray-text text-center">
                        {dayjs()
                            .locale(i18n.language)
                            .day(isWeekStartWithSunday ? index : index + 1)
                            .format("dd")
                            .toLowerCase()}
                    </p>
                </span>
            ))}
            {getMonthData(startDay, endDay).map(date => (
                <Day
                    key={date.format("DD/MM/YYYY")}
                    day={date}
                    isToday={date.isSame(dayjs(), "date")}
                    isOutOfMonth={
                        date.isBefore(currentDate.startOf("month"), "date") ||
                        date.isAfter(currentDate.endOf("month"), "date")
                    }
                    isInRange={isInRange(date, startRange, endRange)}
                    isStartPoint={date.isSame(startRange, "date")}
                    isEndPoint={date.isSame(endRange, "date")}
                    isOneDayRange={startRange.isSame(endRange, "date")}
                    onClick={onDayClick}
                    onMouseEnter={onMouseEnter}
                    isWeekStartWithSunday={isWeekStartWithSunday}
                />
            ))}
        </div>
    );
};
