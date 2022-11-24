import { useEffect, useRef } from "react";

interface UsePreviousReturn<T extends unknown> {
    cur: T | undefined;
    prev: T | undefined;
}
export const usePrevious = <T extends unknown>(value: T) => {
    const ref = useRef<UsePreviousReturn<T>>({
        cur: undefined,
        prev: undefined
    });
    useEffect(() => {
        ref.current = {
            prev: ref.current.cur,
            cur: value
        };
    }, [value]);
    return ref;
};
