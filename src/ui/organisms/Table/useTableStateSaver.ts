import { RefObject, useCallback, useEffect, useState } from "react";
import { useLayoutEffect } from "react";

let tableCache: Record<string, TablePagination | undefined> = {};
export const clearTableCache = () => {
    tableCache = {};
};
interface TablePagination {
    page: number;
    scroll: number;
}

interface HookProps {
    id: string;
    currentPage: number | undefined;
    goToPage: (page: number, bypassScrollTop?: boolean) => void;
    ref: RefObject<HTMLDivElement> | null;
}
export const useTableStateSaver = ({
    id,
    currentPage,
    goToPage,
    ref
}: HookProps) => {
    const [isFirstRender, setRenderFlag] = useState(true);

    const getScrollPosition = useCallback(() => ref?.current?.scrollTop || 0, [
        ref
    ]);
    const scrollTo = useCallback(
        (to: number) => {
            const timer = setInterval(function () {
                if (ref?.current) {
                    ref.current.scrollTo({ top: to });
                    clearInterval(timer);
                }
            }, 200);
        },
        [ref]
    );
    useEffect(() => {
        setRenderFlag(true);
    }, [id]);

    useLayoutEffect(() => {
        if (isFirstRender) {
            tableCache[id] && scrollTo(tableCache[id]?.scroll || 0);
            goToPage(tableCache[id]?.page || 0, true);

            setRenderFlag(false);
        }
    }, [id, isFirstRender, scrollTo, getScrollPosition, currentPage, goToPage]);

    const saveState = () => {
        tableCache = {
            ...tableCache,
            [id]: {
                scroll: getScrollPosition(),
                page: currentPage || 0
            }
        };
    };
    return {
        ref,
        saveState
    };
};
