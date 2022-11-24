import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const getSafariFriendlyDate = (value: dayjs.ConfigType) =>
    dayjs(value, "YYYY-MM-DDTHH:mm:ss.000ZZ");
