import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { dateMask, getEndOfDate, getFormattedDate, getStartOfDate, serverDateMask, validateDateFormat } from "../Calendar/dateUtils";

interface UsePickerProps {
    defaultRange: string[];
}

export const usePicker = ({ defaultRange }: UsePickerProps) => {
    const { i18n } = useTranslation();
    const { setValue } = useFormContext();
    const [visible, setVisible] = useState(false);
    const [startRange, setStartRange] = useState(defaultRange[1]);
    const [endRange, setEndRange] = useState(defaultRange[0]);
    const [selected, setSelected] = useState<Dayjs | null>(null);
    const [startValue, setStartValue] = useState(getFormattedDate(defaultRange[1]));
    const [endValue, setEndValue] = useState(getFormattedDate(defaultRange[0]));
    const [startError, setStartError] = useState(false);
    const [endError, setEndError] = useState(false);

    const onEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndValue(e.target.value);
        if (e.target.value === "") {
            setEndError(false);
        }
        if (e.target.value.length >= 10) {
            setEndError(!validateDateFormat(e.target.value));
        }
    };

    const onStartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartValue(e.target.value);
        if (e.target.value === "") {
            setStartError(false);
        }
        if (e.target.value.length >= 10) {
            setStartError(!validateDateFormat(e.target.value));
        }
    };

    const onSubmit = () => {
        if (startError || startValue === "") {
            setStartError(true);
            endValue === "" && setEndError(true);
        } else if (endError || endValue === "") {
            setEndError(true);
            startValue === "" && setStartError(true);
        } else {
            if (
                dayjs(startValue, serverDateMask).isBefore(
                    dayjs(endValue, serverDateMask),
                    "date"
                )
            ) {
                setStartRange(endValue);
                setEndRange(startValue);
            } else {
                setStartRange(startValue);
                setEndRange(endValue);
            }
            if (
                dayjs(endValue, dateMask).isBefore(
                    dayjs(startValue, dateMask),
                    "date"
                )
            ) {
                setValue("period", {
                    label: "customRange",
                    value: [
                        getStartOfDate(endValue, dateMask),
                        getEndOfDate(startValue, dateMask)
                    ]
                });
            } else {
                setValue("period", {
                    label: "customRange",
                    value: [
                        getStartOfDate(startValue, dateMask),
                        getEndOfDate(endValue, dateMask)
                    ]
                });
            }
            setVisible(false);
            setStartValue(getFormattedDate(defaultRange[1]));
            setEndValue(getFormattedDate(defaultRange[0]));
        }
    };
    useEffect(() => {
        setStartRange(defaultRange[1]);
        setEndRange(defaultRange[0]);
        setStartValue(getFormattedDate(defaultRange[1]));
        setEndValue(getFormattedDate(defaultRange[0]));
    }, [defaultRange, setStartRange, setEndRange]);

    const onMouseEnter = (day: Dayjs) => {
        if (selected) {
            if (selected.isBefore(day, "date")) {
                setStartRange(day.format(serverDateMask));
                setEndRange(selected?.format(serverDateMask));
            } else {
                setEndRange(day.format(serverDateMask));
                setStartRange(selected?.format(serverDateMask));
            }
        }
    };

    const onDayClick = (day: Dayjs) => {
        if (!selected) {
            setSelected(day);
            setStartRange(day.format(serverDateMask));
            setEndRange(day.format(serverDateMask));
        } else {
            if (selected.isBefore(day, "date")) {
                setStartRange(day.format(serverDateMask));
                setEndRange(selected?.format(serverDateMask));
                setSelected(null);
                setValue("period", {
                    label: "customRange",
                    value: [
                        getStartOfDate(selected, serverDateMask),
                        getEndOfDate(day, serverDateMask)
                    ]
                });
            } else {
                setEndRange(day.format(serverDateMask));
                setStartRange(selected?.format(serverDateMask));
                setSelected(null);
                setValue("period", {
                    label: "customRange",
                    value: [
                        getStartOfDate(day, serverDateMask),
                        getEndOfDate(selected, serverDateMask)
                    ]
                });
            }
        }
    };

    return {
        startRange,
        endRange,
        startInputValue: startValue,
        endInputValue: endValue,
        startInputError: startError,
        endInputError: endError,
        visible,
        setVisible,
        onDayClick,
        onMouseEnter,
        onEndInputChange,
        onStartInputChange,
        onInputsSubmit: onSubmit,
        isWeekStartWithSunday: i18n.language === "en",
        setStartError,
        setEndError
    };
};
