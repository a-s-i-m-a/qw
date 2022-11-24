import React, { FC, useState } from "react";
import { Input, InputProps } from "../../atoms/Input";
import cn from "classnames";
import { HiddenEye, VisibleEye } from "../Icon";
import { useController } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";

export interface FormInputProps
    extends Pick<
        InputProps,
        | "name"
        | "type"
        | "isMaskedNumber"
        | "suffix"
        | "autoFocus"
        | "decimalScale"
        | "min"
        | "max"
        | "isAllowed"
        | "allowNegative"
        | "placeholder"
        | "format"
        | "isDisabled"
        | "maxLength"
        | "mask"
    > {
    label?: string;
    className?: string;
    onInputClick?: () => void;
    inputClasses?: string;
    iconClasses?: string;
    isEditing?: boolean;
    Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    hideLabel?: boolean;
    defaultValue?: string | number;
    multiplyingKoef?: number;
    isNumericString?: boolean;
    description?: string;
    renderValue?: (value: string) => React.ReactNode;
}

const defaultRenderFunction = (value: string) => (
    <span className="font-normal text-base text-dark-main">{value}</span>
);
export const FormInput: FC<FormInputProps> = ({
    label,
    name,
    className = "",
    iconClasses = "",
    inputClasses = "",
    Icon,
    type,
    hideLabel,
    isMaskedNumber = false,
    onInputClick,
    isEditing = true,
    suffix,
    autoFocus,
    decimalScale,
    min,
    allowNegative,
    placeholder,
    defaultValue,
    max,
    isAllowed,
    multiplyingKoef,
    format,
    isDisabled,
    isNumericString,
    description,
    renderValue = defaultRenderFunction,
    maxLength,
    mask
}) => {
    const context = useFormContext();
    if (!context) {
        throw new Error("Provide FormContext before FormInput");
    }
    const { control } = context;
    const {
        field,
        fieldState: { error }
    } = useController({
        name,
        control,
        defaultValue
    });

    const [isHidden, setHidden] = useState<boolean>(true);

    const iconClassName = cn(
        "absolute right-0 mr-4.5 my-3",
        {
            "cursor-pointer": type === "password",
            "top-30p": label,
            "top-0.5": !label
        },
        iconClasses
    );

    const handleHide = () => setHidden(prev => !prev);

    const wrapperCn = cn("relative inline-block", className);
    const inputClassName = cn(
        {
            "pr-11": Icon || type === "password"
        },
        inputClasses
    );

    return (
        <label className={wrapperCn}>
            {!hideLabel && label && (
                <div className="text-14 text-gray-text font-semibold mb-3 ">
                    {label}
                </div>
            )}
            {isEditing ? (
                <>
                    <Input
                        onClick={onInputClick}
                        type={isHidden ? type : "text"}
                        isError={!!error}
                        isMaskedNumber={isMaskedNumber}
                        inputClasses={inputClassName}
                        suffix={suffix}
                        autoFocus={autoFocus}
                        decimalScale={decimalScale}
                        min={min}
                        allowNegative={allowNegative}
                        placeholder={placeholder}
                        max={max}
                        isAllowed={isAllowed}
                        format={format}
                        multiplyingKoef={multiplyingKoef}
                        isDisabled={isDisabled}
                        isNumericString={isNumericString}
                        maxLength={maxLength}
                        mask={mask}
                        {...field}
                    />
                    {type === "password" &&
                        (isHidden ? (
                            <HiddenEye
                                className={iconClassName}
                                onClick={handleHide}
                            />
                        ) : (
                            <VisibleEye
                                className={iconClassName}
                                onClick={handleHide}
                            />
                        ))}
                    {type !== "password" && Icon && (
                        <Icon className={iconClassName} />
                    )}
                    <AnimatePresence>
                        {!hideLabel && error && (
                            <motion.span
                                initial={{ y: -5, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -5, opacity: 0 }}
                                transition={{
                                    duration: 0.2
                                }}
                                className="inline-block text-12 font-normal text-danger mt-3"
                            >
                                {error.message}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </>
            ) : (
                renderValue(
                    field.value && field?.value !== ""
                        ? `${
                              multiplyingKoef
                                  ? field.value / multiplyingKoef
                                  : field.value
                          }${suffix ? suffix : ""}`
                        : "—"
                )
            )}
            {description && isEditing && !error && (
                <div className={`text-12 text-gray-text mt-3`}>
                    {description}
                </div>
            )}
        </label>
    );
};
