import dayjs from "dayjs";
import { TFunction } from "i18next";
import { serverDateMask } from "../../../ui/organisms/Calendar/dateUtils";
import { TabOptions } from "../ui/molecules/SelectPeriodTabs/TabList";

const today = dayjs().format(serverDateMask);
export const startOfToday = dayjs().startOf("day").format(serverDateMask);
const startOfYesterday = dayjs()
    .add(-1, "day")
    .startOf("day")
    .format(serverDateMask);
const endOfYesterday = dayjs()
    .add(-1, "day")
    .endOf("date")
    .format(serverDateMask);
const weekAgo = dayjs().add(-6, "day").startOf("day").format(serverDateMask);
const monthAgo = dayjs().add(-1, "month").startOf("day").format(serverDateMask);
const yearAgo = dayjs().add(-1, "year").startOf("day").format(serverDateMask);

export const getPeriodTabs = (t: TFunction): TabOptions[] => {
    return [
        {
            label: t("stats.today"),
            value: [startOfToday, today]
        },
        {
            label: t("stats.yesterday"),
            value: [startOfYesterday, endOfYesterday]
        },
        {
            label: t("stats.week"),
            value: [weekAgo, today]
        },
        {
            label: t("stats.month"),
            value: [monthAgo, today]
        },
        {
            label: t("stats.year"),
            value: [yearAgo, today]
        }
    ];
};
