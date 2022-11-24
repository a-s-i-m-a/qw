import { FC, useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";
import cn from "classnames";
import { useModal } from "./hooks";

export const ModalPage: FC = observer(({ children }) => {
    const [modalState, setModalState] = useState<boolean>(false);
    const { activeModalId } = useModal();

    useEffect(() => {
        activeModalId ? setModalState(true) : setModalState(false);
    }, [activeModalId]);

    const translateAnimation = {
        hidden: {
            y: 500,
            opacity: 0
        },

        visible: {
            y: 0,
            opacity: 1
        }
    };

    const opacityAnimation = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 }
    };

    const overlayClasses = cn(
        "min-w-1400p w-screen h-screen absolute bg-gray-main bg-opacity-75 flex items-center justify-center top-0 z-200",
        {
            " hidden": !modalState
        }
    );
    const coverClasses = cn("w-full flex items-center justify-center h-full");

    return (
        <AnimatePresence>
            <motion.div
                variants={opacityAnimation}
                className={overlayClasses}
                id="modal-overlay"
                animate={modalState ? "visible" : "hidden"}
                initial="hidden"
                exit="hidden"
            >
                <motion.div
                    variants={translateAnimation}
                    className={coverClasses}
                    id="modal-child-cover"
                    animate={modalState ? "visible" : "hidden"}
                    initial="hidden"
                >
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
});
