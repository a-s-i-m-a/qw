import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

export const serverDateMask = "YYYY-MM-DDTHH:mm:ss.SSSZZ";
export const dateMask = "DD.MM.YYYY";

export const isInRange = (date: Dayjs, start: Dayjs, end: Dayjs) => {
    return date.isBetween(end, start);
};

export const getStartDate = (
    currentDate: Dayjs,
    isWeekStartWithSunday: boolean
) => {
    if (isWeekStartWithSunday) {
        return currentDate.startOf("month").startOf("week");
    }
    return currentDate.startOf("month").startOf("week").add(1, "day");
};

export const getEndDate = (
    currentDate: Dayjs,
    isWeekStartWithSunday: boolean
) => {
    if (isWeekStartWithSunday) {
        return currentDate.endOf("month").endOf("week");
    }
    return currentDate.endOf("month").endOf("week").add(1, "day");
};

export const getMonthData = (startDay: Dayjs, endDay: Dayjs) => {
    const data: Dayjs[] = [];
    let day: Dayjs = startDay;
    while (endDay.isAfter(day)) {
        data.push(day);
        day = day.add(1, "day");
    }
    return data;
};

export const validateDateFormat = (date: string) => {
    const regex = new RegExp(
        /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)[0-9]{2}$/
    );
    return regex.test(date);
};

export const getFormattedDate = (date: string) => {
    return dayjs(date, serverDateMask).format(dateMask);
};

export const getStartOfDate = (date: string | Dayjs, mask: string) => {
    return dayjs(date, mask).startOf("day").format(serverDateMask);
};

export const getEndOfDate = (date: string | Dayjs, mask: string) => {
    return dayjs(date, mask).endOf("day").format(serverDateMask);;
};
