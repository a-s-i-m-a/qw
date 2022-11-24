import { AnimatePresence, motion } from "framer-motion";
import { useState, FC, memo } from "react";
import ReactDOM from "react-dom";

import { usePopper, PopperChildrenProps } from "react-popper";

interface PopperProps {
    referenceElement: Element | null;
    placement?: PopperChildrenProps["placement"];
    offset?: number;
    styleClasses?: string;
}
export const Popper: FC<PopperProps> = memo(
    ({
        children,
        referenceElement,
        placement,
        offset = 5,
        styleClasses = "shadow-popper py-2 rounded-xl min-w-146p bg-white overflow-hidden"
    }) => {
        const [
            popperElement,
            setPopperElement
        ] = useState<HTMLDivElement | null>(null);

        const { styles, attributes } = usePopper(
            referenceElement,
            popperElement,
            {
                placement,
                modifiers: [
                    {
                        name: "offset",
                        options: {
                            offset: [0, offset]
                        }
                    }
                ]
            }
        );

        return ReactDOM.createPortal(
            <AnimatePresence>
                <motion.div
                    id="tooltip"
                    role="tooltip"
                    style={styles.popper}
                    ref={setPopperElement}
                    {...attributes.popper}
                    className="z-100"
                    onClick={event => event.stopPropagation()}
                    initial={{ opacity: 0, top: 10 }}
                    animate={{ opacity: 1, top: 0 }}
                    exit={{ opacity: 0, top: 10 }}
                    transition={{ duration: 0.1 }}
                >
                    <div style={{ padding: offset }}>
                        <div className={styleClasses}>{children}</div>
                    </div>
                </motion.div>
            </AnimatePresence>,
            document.getElementById("popper-root")!
        );
    }
);
