import { useEffect, RefObject } from "react";

export const useClickOutside = (
    ref: RefObject<Element>,
    onClick: () => void,
    root: HTMLElement | Document | null | undefined = document
) => {
    useEffect(() => {
        const listener = (e: Event) => {
            if (!ref?.current?.contains(e.target as Node)) {
                onClick();
            }
        };
        if (root !== null) {
            root.addEventListener("mousedown", listener);
            root.addEventListener("touchstart", listener);
        }

        return () => {
            if (root !== null) {
                root.removeEventListener("mousedown", listener);
                root.removeEventListener("touchstart", listener);
            }
        };
    }, [onClick, ref, root]);
};
