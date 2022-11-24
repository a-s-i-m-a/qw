import { FC, useState } from "react";
import { DropdownArrow } from "../../atoms/Icon";
import cn from "classnames";
import { usePopper } from "react-popper";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "../../../features/utils/hooks/useClickOutside";
import { observer } from "mobx-react-lite";
import { Currency } from "../../../features/types";
import { TFunction, useTranslation } from "react-i18next";
interface DropdownProps {
    className?: string;
    selected: string;
    select: (value: Currency) => void;
}

interface CurrencyOptions {
    label: string;
    value: Currency;
}

const getOptions = (t: TFunction): CurrencyOptions[] => {
    return [
        {
            label: t("rubShort").toUpperCase(),
            value: "rub"
        },
        {
            label: t("usdShort").toUpperCase(),
            value: "usd"
        },
        {
            label: t("eurShort").toUpperCase(),
            value: "eur"
        }
    ];
};
export const CurrencyChanger: FC<DropdownProps> = observer(
    ({ className, select, selected }) => {
        const { t } = useTranslation();
        const [
            popperElement,
            setPopperElement
        ] = useState<HTMLDivElement | null>(null);
        const [isVisible, setVisible] = useState(false);
        const [
            referenceElement,
            setReferenceElement
        ] = useState<HTMLDivElement | null>(null);
        const labelCn = cn(
            className,
            "flex font-semibold text-14 text-gray-text cursor-pointer w-54p"
        );
        const { styles, attributes } = usePopper(
            referenceElement,
            popperElement
        );

        const triggerVisibility = () => {
            setVisible(prev => !prev);
        };
        useClickOutside(
            {
                current: referenceElement
            },
            () => setVisible(false)
        );
        const selectOption = (value: Currency) => {
            select(value);
            setVisible(false);
        };
        return (
            <div
                className={labelCn}
                ref={setReferenceElement}
                onClick={triggerVisibility}
            >
                {getOptions(t).find(item => item.value === selected)?.label}
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
                    <DropdownArrow className="text-dark-main" />
                </motion.div>
                <AnimatePresence>
                    {isVisible && (
                        <motion.div
                            id="tooltip"
                            role="tooltip"
                            style={{ ...styles.popper }}
                            initial={{ opacity: 0, top: 20 }}
                            animate={{ opacity: 1, top: 0 }}
                            exit={{ opacity: 0, top: 20 }}
                            transition={{ duration: 0.1 }}
                            ref={setPopperElement}
                            {...attributes.popper}
                            data-show={true}
                            onClick={event => event.stopPropagation()}
                            className="p-3 cursor-default"
                        >
                            <ul className="p-5 shadow-dropdown flex flex-col w-28 ">
                                {getOptions(t).map(currency => (
                                    <li
                                        key={currency.value}
                                        className={`mb-3 last:mb-0 font-normal hover:text-purple-main cursor-pointer ${
                                            selected === currency.value
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);
