import { FC } from "react";
import { motion } from "framer-motion";
import { Toggle } from "../../../../ui/atoms/Toggle";
import cn from "classnames";

interface AccordionProps {
    title: string;
    description: string;
    className?: string;
    value: boolean;
    onChange: (flag: boolean) => void;
    isEditing?: boolean;
    hideToggle?: boolean;
}

export const Accordion: FC<AccordionProps> = ({
    title,
    description,
    value,
    className,
    onChange,
    children,
    isEditing = true,
    hideToggle = false
}) => {
    const itemClasses = cn(
        "border-2 border-gray-bg rounded-20p flex flex-col",
        className
    );
    const headerClasses = cn("bg-gray-bg rounded-t-20p p-30p", {
        "cursor-pointer": isEditing
    });
    const toggle = () => isEditing && onChange(!value);

    return (
        <motion.section
            initial={false}
            animate={{
                height: value ? "auto" : 119,
                overflow: value && children ? "visible" : "hidden"
            }}
            transition={{ duration: 0.2 }}
            className={itemClasses}
        >
            <section className={headerClasses} onClick={toggle}>
                <section className="h-30p flex justify-between items-center mb-5p">
                    <h3 className="text-14 font-semibold">{title}</h3>

                    {!hideToggle && (
                        <Toggle
                            onChange={toggle}
                            isChecked={value}
                            isDisabled={!isEditing}
                            className="pointer-events-none"
                        />
                    )}
                </section>

                <p className="text-14 text-gray-text leading-5">
                    {description}
                </p>
            </section>
            {children && (
                <section className="bg-white py-5 px-30p rounded-b-20p border-t-0 ">
                    {children}
                </section>
            )}
        </motion.section>
    );
};
