import { FC } from "react";
import cn from "classnames";
import NumberFormat, { NumberFormatProps } from "react-number-format";
import { forwardRef } from "react";
import { ControllerRenderProps } from "react-hook-form";

export interface InputProps extends NumberFormatProps {
    isError?: boolean;
    isMaskedNumber?: boolean;
    inputClasses?: string;
    name: string;
    onChange: ControllerRenderProps["onChange"];
    shouldBeMultiplied?: boolean;
    isDisabled?: boolean;
}
const getValue = (
    value: InputProps["value"],
    isNumber: boolean,
    multiplyingKoef: number
) => {
    if (value === undefined || value === null) {
        return "";
    }

    if (isNumber && value !== "") {
        return Number(value) / multiplyingKoef;
    }

    return value;
};
export const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            name,
            type,
            isError = false,
            isMaskedNumber = false,
            value,
            inputClasses,
            autoComplete,
            onChange,
            shouldBeMultiplied,
            isNumericString = true,
            multiplyingKoef = 1,
            isDisabled,
            isAllowed,
            allowNegative,
            decimalScale,
            ...rest
        },
        ref
    ) => {
        const inputCn = cn(
            "w-full bg-gray-bg rounded-10p font-normal placeholder-gray-text",
            "px-4.5 py-11p",
            "",
            {
                "border border-danger": isError,
                "text-dark-main": !isDisabled,
                "text-gray-text": isDisabled
            },
            inputClasses
        );

        if (isMaskedNumber) {
            return (
                <NumberFormat
                    autoComplete={autoComplete || name}
                    type={type as NumberFormatProps["type"]}
                    name={name}
                    placeholder=" "
                    className={inputCn}
                    value={getValue(
                        value,
                        isMaskedNumber && isNumericString,
                        multiplyingKoef
                    )}
                    {...rest}
                    isNumericString={isNumericString}
                    getInputRef={ref}
                    isAllowed={isAllowed}
                    decimalScale={decimalScale}
                    allowNegative={allowNegative}
                    onValueChange={({ floatValue, formattedValue }) => {
                        if (!isNumericString) {
                            console.log("new", formattedValue);

                            onChange(formattedValue);
                        } else {
                            onChange(
                                floatValue !== undefined
                                    ? Number(floatValue) * multiplyingKoef
                                    : ""
                            );
                        }
                    }}
                    allowedDecimalSeparators={[".", ","]}
                    disabled={isDisabled}
                />
            );
        }
        return (
            <input
                autoComplete={autoComplete || name}
                type={type}
                name={name}
                placeholder=" "
                className={inputCn}
                value={getValue(value, false, multiplyingKoef)!}
                {...rest}
                ref={ref}
                onChange={onChange}
                disabled={isDisabled}
            />
        );
    }
);
