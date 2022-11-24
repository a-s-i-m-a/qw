import { CustomTypeOptions, TFunction } from "react-i18next";
import { OptionsType } from "react-select";
import { OptionType } from ".";

export const getText = (
    value: OptionType | OptionsType<OptionType>,
    t?: TFunction
) => {
    if (value instanceof Array) {
        if (!t) {
            return value.map((item: OptionType) => item.label).join(", ");
        } else {
            return value
                .map((item: OptionType) =>
                    t(
                        `${item.label}` as keyof CustomTypeOptions["resources"]["en"]
                    )
                )
                .join(", ");
        }
    } else {
        if (!t) {
            return value.label;
        } else {
            return t(
                `${value.label}` as keyof CustomTypeOptions["resources"]["en"]
            );
        }
    }
};
