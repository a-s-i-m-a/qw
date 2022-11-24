import { FC, useState } from "react";
import { Input, InputProps } from "../../atoms/Input";
import cn from "classnames";
import { DropdownArrow } from "../Icon";
import { useController, useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { usePopper } from "react-popper";
import { useClickOutside } from "../../../features/utils/hooks/useClickOutside";
import { useTranslation } from "react-i18next";
import { getSuffix } from "../../../features/utils/getSuffix";
import { formatThousands } from "../../../features/utils/formatNumber";
import { getOptions } from "./getOptions";

interface FormInputProps {
    label: string;
    name: string;
    className?: string;
    hideLabel?: boolean;
    isEditing?: boolean;
    placeholder?: string;
    isCurrencyDisabled?: boolean;
    isDisabled?: boolean;
    isAllowed?: InputProps["isAllowed"];
}

export const MoneyInput: FC<FormInputProps> = ({
    label,
    name,
    className = "",
    hideLabel,
    placeholder,
    isEditing = true,
    isCurrencyDisabled,
    isDisabled,
    isAllowed
}) => {
    const { control } = useFormContext();
    if (!control) {
        throw new Error("Provide FormContext before MoneyInput");
    }

    const { t } = useTranslation();
    const {
        field: valueField,
        fieldState: { error: valueError }
    } = useController({
        name: `${name}.value`,
        control,
        defaultValue: 0
    });
    const {
        field: currencyField,
        fieldState: { error: currencyError }
    } = useController({
        name: `${name}.currency`,
        control,
        defaultValue: "usd"
    });

    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
        null
    );
    const [
        referenceElement,
        setReferenceElement
    ] = useState<HTMLDivElement | null>(null);
    const [isVisible, setVisible] = useState(false);
    const { styles, attributes } = usePopper(referenceElement, popperElement);

    const triggerVisibility = () => {
        !isCurrencyDisabled && !isDisabled && setVisible(prev => !prev);
    };
    useClickOutside(
        {
            current: referenceElement
        },
        () => setVisible(false)
    );

    const selectorClasses = cn(
        "absolute z-20 right-0 bottom-0 mr-4.5 my-3 flex items-center pl-4 border-l border-gray-main h-5",
        {
            "cursor-pointer": !isCurrencyDisabled && !isDisabled,
            "text-gray-main": isCurrencyDisabled || isDisabled
        }
    );

    const wrapperCn = cn("inline-block w-full", className);
    const inputClassName = cn("pr-20");
    const selectOption = (currency: string) => {
        currencyField.onChange(currency);
        setVisible(false);
    };
    return (
        <label className={wrapperCn}>
            {!hideLabel && (
                <div className="text-14 text-gray-text font-semibold mb-3 pr-1">
                    {label}
                </div>
            )}

            {isEditing ? (
                <>
                    <div className="relative">
                        <Input
                            isMaskedNumber={true}
                            inputClasses={inputClassName}
                            type="tel"
                            allowNegative={false}
                            decimalScale={2}
                            thousandSeparator={" "}
                            shouldBeMultiplied={true}
                            autoComplete={""}
                            placeholder={placeholder}
                            isError={!!currencyError || !!valueError}
                            multiplyingKoef={100}
                            isDisabled={isDisabled}
                            isAllowed={isAllowed}
                            {...valueField}
                        />
                        <div
                            className={selectorClasses}
                            ref={setReferenceElement}
                            onClick={triggerVisibility}
                        >
                            <span className="w-5">
                                {getSuffix(currencyField.value)}
                            </span>
                            <motion.div
                                className="ml-1"
                                animate={
                                    isVisible
                                        ? {
                                              rotateX: 0
                                          }
                                        : { rotateX: 180 }
                                }
                            >
                                <DropdownArrow
                                    className={
                                        isCurrencyDisabled || isDisabled
                                            ? "text-gray-main"
                                            : "text-dark-main"
                                    }
                                />
                            </motion.div>
                            {isVisible && (
                                <div
                                    id="tooltip"
                                    role="tooltip"
                                    style={{ ...styles.popper }}
                                    ref={setPopperElement}
                                    {...attributes.popper}
                                    data-show={true}
                                    onClick={event => event.stopPropagation()}
                                    className="p-3 cursor-default"
                                >
                                    <ul className="p-5 shadow-dropdown flex flex-col w-36 rounded-20p bg-white">
                                        {getOptions(t).map(currency => (
                                            <li
                                                key={currency.value}
                                                className={`mb-3 last:mb-0 font-normal hover:text-purple-main cursor-pointer ${
                                                    currencyField.value ===
                                                    currency.value
                                                        ? "text-purple-main"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    selectOption(currency.value)
                                                }
                                            >
                                                {currency.label}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {!hideLabel && valueError && (
                        <div className="text-12 font-normal text-danger mt-3">
                            {valueError?.message}
                        </div>
                    )}
                </>
            ) : (
                <span className="h-9 font-normal text-base text-dark-main">
                    {`${formatThousands(valueField.value / 100)} ${getSuffix(
                        currencyField.value
                    )}`}
                </span>
            )}
        </label>
    );
};
