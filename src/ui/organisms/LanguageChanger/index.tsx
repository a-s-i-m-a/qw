import { FC, useEffect, useState } from "react";
import { DropdownArrow } from "../../atoms/Icon";
import cn from "classnames";
import { usePopper } from "react-popper";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "../../../features/utils/hooks/useClickOutside";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
interface DropdownProps {
    className: string;
}

const options = [
    {
        shortLabel: "РУС",
        label: "Русский",
        value: "ru"
    },
    {
        shortLabel: "EN",
        label: "English",
        value: "en"
    }
];
export const LanguageChanger: FC<DropdownProps> = observer(({ className }) => {
    const { i18n } = useTranslation();

    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
        null
    );
    const [isVisible, setVisible] = useState(false);
    const [
        referenceElement,
        setReferenceElement
    ] = useState<HTMLDivElement | null>(null);
    const [selected, select] = useState(i18n.language || "en");
    useEffect(() => {
        select(i18n.language);
    }, [i18n.language]);
    const labelCn = cn(
        className,
        "flex font-semibold text-14 text-gray-text cursor-pointer"
    );
    const { styles, attributes } = usePopper(referenceElement, popperElement);

    const triggerVisibility = () => {
        setVisible(prev => !prev);
    };
    useClickOutside(
        {
            current: referenceElement
        },
        () => setVisible(false)
    );
    const selectOption = (value: string) => {
        select(value);
        i18n.changeLanguage(value);
        setVisible(false);
    };
    return (
        <div
            className={labelCn}
            ref={setReferenceElement}
            onClick={triggerVisibility}
        >
            {options.find(item => item.value === selected)?.shortLabel}
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
                        <ul className="p-5 shadow-dropdown flex flex-col w-36 ">
                            {options.map(lang => (
                                <li
                                    key={lang.value}
                                    className={`mb-3 last:mb-0 font-normal hover:text-purple-main cursor-pointer ${
                                        selected === lang.value
                                            ? "text-purple-main"
                                            : ""
                                    }`}
                                    onClick={() => selectOption(lang.value)}
                                >
                                    {lang.label}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});
