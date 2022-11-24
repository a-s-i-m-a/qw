import { motion } from "framer-motion";
import React, { FC, useEffect, useRef, useState } from "react";
import { useMeasure } from "../../../features/utils/hooks/useMeasure";

interface TabListProps {
    options: string[];
    activeIndex: number;
    onChange: (index: number) => void;
    className?: string;
}

export const TabList: FC<TabListProps> = ({
    options,
    onChange,
    activeIndex,
    className = ""
}) => {
    const [slider, setSlider] = useState({
        x: 0,
        width: 0,
        hasValue: false
    });
    const childRefs = useRef(new Map<number, HTMLButtonElement | null>());
    const tabListRef = useRef<HTMLElement>(null);
    const { bounds, ref } = useMeasure();
    useEffect(() => {
        const target = childRefs.current.get(activeIndex);
        const container = tabListRef.current;
        if (target && container) {
            const cRect = container.getBoundingClientRect();

            if (cRect.width === 0) {
                return;
            }

            const tRect = target.getBoundingClientRect();

            const x = tRect.left - cRect.left;
            const width = tRect.width;

            setSlider({
                hasValue: true,
                x,
                width
            });
        }
    }, [activeIndex, bounds]);

    const handleOnChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (event.currentTarget?.dataset?.tab) {
            onChange(Number(event.currentTarget?.dataset?.tab));
        }
    };

    return (
        <section ref={ref} className={`flex  flex-shrink-0 ${className}`}>
            <section className="pb-2 relative" ref={tabListRef}>
                {slider.hasValue && (
                    <motion.div
                        className="h-0.5 bottom-0 absolute bg-purple-main"
                        animate={{
                            x: slider.x,
                            width: slider.width
                        }}
                        transition={{
                            bounceDamping: 3
                        }}
                        initial={false}
                    />
                )}
                {options.map((tab, i) => (
                    <motion.button
                        key={tab}
                        ref={el => childRefs.current.set(i, el)}
                        data-tab={i}
                        title={tab}
                        onClick={handleOnChange}
                        className={`tab--item shadow-none transition-all outline-none focus:outline-none mr-8 last:mr-0 text-base whitespace-nowrap ${
                            i === activeIndex
                                ? "font-semibold text-purple-main"
                                : "font-normal text-dark-main"
                        }`}
                        transition={{ duration: 0.1 }}
                        type="button"
                    >
                        {tab}
                    </motion.button>
                ))}
            </section>
        </section>
    );
};
