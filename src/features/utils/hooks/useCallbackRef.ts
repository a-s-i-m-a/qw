import { useState, useCallback } from "react";

export const useCallbackRef = () => {
    const [ref, setRef] = useState(null);
    const fn = useCallback(node => {
        setRef(node);
    }, []);

    return [ref, fn];
};
