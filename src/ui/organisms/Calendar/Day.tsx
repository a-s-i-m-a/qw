import { Dayjs } from "dayjs";
import React, { FC } from "react";
import cn from "classnames";

interface DayProps {
    day: Dayjs;
    isToday: boolean;
    isOutOfMonth: boolean;
    isInRange?: boolean;
    isStartPoint?: boolean;
    isEndPoint?: boolean;
    isOneDayRange?: boolean;
    isWeekStartWithSunday?: boolean;
    onClick: (day: Dayjs) => void;
    onMouseEnter: (day: Dayjs) => void;
}

export const Day: FC<DayProps> = ({
    day,
    isToday,
    isOutOfMonth,
    isInRange,
    isStartPoint,
    isEndPoint,
    isOneDayRange,
    onClick,
    onMouseEnter,
    isWeekStartWithSunday
}) => {
    const cellClasses = "w-35p mx-auto flex flex-row py-px";
    const dateClasses = cn(
        "text-12 h-28p w-28p py-px mx-auto flex items-center justify-center",
        "relative -left-14p z-105 border-transparent border cursor-default",
        "hover:bg-purple-bg hover:rounded-full",
        {
            "border border-purple-mainAlpha rounded-full": isToday,
            "text-gray-text": isOutOfMonth,
            "bg-purple-bg rounded-full": isStartPoint || isEndPoint || isInRange
        }
    );
    const leftClasses = cn("w-1/2", {
        "bg-purple-bg": (!isOneDayRange && isStartPoint) || isInRange,
        "bg-white": isWeekStartWithSunday
            ? day.day() === 0
            : day.day() === 1 || isOneDayRange || (!isInRange && !isStartPoint)
    });

    const rightClasses = cn("w-1/2", {
        "bg-purple-bg": (!isOneDayRange && isEndPoint) || isInRange,
        "bg-white": isWeekStartWithSunday
            ? day.day() === 6
            : day.day() === 0 ||
              isOneDayRange ||
              (!isInRange && !isEndPoint) ||
              isStartPoint
    });
    return (
        <section className={cellClasses}>
            <span className={leftClasses}></span>
            <span className={rightClasses}>
                <span
                    className={dateClasses}
                    onClick={() => onClick(day)}
                    onMouseEnter={() => onMouseEnter(day)}
                >
                    {day.get("date")}
                </span>
            </span>
        </section>
    );
};
