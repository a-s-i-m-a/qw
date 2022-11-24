import { TFunction } from "i18next";
import { Currencies } from "../../../features/types";
import { OptionType } from "../Select";

export const getOptions = (t: TFunction): OptionType[] =>
    Currencies.map(currency => ({ value: currency, label: t(`${currency}`) }));
