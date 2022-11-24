import { Dayjs } from "dayjs";
import React, { FC } from "react";
import { LeftIcon, RightIcon } from "../../atoms/Icon";
import "dayjs/locale/ru";
import "dayjs/locale/en";
import "dayjs/locale/it";
import { useTranslation } from "react-i18next";

interface HeaderProps {
    currentDay: Dayjs;
    onPrevMonth: () => void;
    onNextMonth: () => void;
}

export const Header: FC<HeaderProps> = ({
    currentDay,
    onPrevMonth,
    onNextMonth
}) => {
    const { i18n } = useTranslation();
    return (
        <div className="flex flex-row justify-between mb-20p">
            <button
                className="w-28p flex justify-center focus:outline-none"
                onClick={onPrevMonth}
            >
                <LeftIcon />
            </button>
            <p className="text-14 font-semibold">
                {currentDay.locale(i18n.language).format("MMMM, YYYY")}
            </p>
            <button
                className="w-28p flex justify-center focus:outline-none"
                onClick={onNextMonth}
            >
                <RightIcon />
            </button>
        </div>
    );
};
