/* eslint-disable no-unused-vars */
import { RefObject, useCallback, useEffect, useReducer } from "react";
import { Column } from "./types";

interface State {
    page: number | undefined;
    pageCount: number;
    isLoading: boolean;
    sort: string | null;
    search: string;
}

enum ActionKind {
    PageChange = "PAGECHANGE",
    CountChange = "COUNTCHANGE",
    SortChange = "SORTCHANGE",
    ForceLoading = "FORCELOADING",
    SearchChange = "SEARCHCHANGE"
}

type Action =
    | {
          type: ActionKind.PageChange;
          payload: { page: number };
      }
    | {
          type: ActionKind.CountChange;
          payload: { pageCount: number };
      }
    | {
          type: ActionKind.SortChange;
          payload: { sort: string | null };
      }
    | {
          type: ActionKind.ForceLoading;
      }
      | {
        type: ActionKind.SearchChange
        payload: { search: string, page: number };
  };

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case ActionKind.PageChange:
            return {
                ...state,
                ...action.payload
            };
        case ActionKind.CountChange:
            return {
                ...state,
                ...action.payload
            };
        case ActionKind.ForceLoading:
            return {
                ...state,
                isLoading: true
            };
        case ActionKind.SortChange:
            console.log(state, action);

            return {
                ...state,
                sort: action.payload.sort,
                page: state.sort !== action.payload.sort ? 0 : state.page
            };
        case ActionKind.SearchChange:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};
interface useTableProps<DType extends object> {
    data: DType[];
    waitForPage?: boolean;
    id: string;
    itemsCount: number;
    forceSort?: string;
    tableRef?: RefObject<HTMLDivElement> | null;
}
export const useTable = <DType extends object>({
    waitForPage = false,
    id: tableId,
    itemsCount,
    forceSort,
    data,
    tableRef
}: useTableProps<DType>) => {
    const [state, dispatch] = useReducer(reducer, {
        page: undefined,
        pageCount: 1,
        isLoading: true,
        sort: forceSort ?? null,
        search: ""
    });

    useEffect(() => {
        dispatch({
            type: ActionKind.SortChange,
            payload: {
                sort: forceSort || null
            }
        });
    }, [tableId, forceSort]);
    useEffect(() => {
        !waitForPage &&
            dispatch({
                type: ActionKind.PageChange,
                payload: { page: 0 }
            });
        tableRef?.current?.scrollTo({ top: 0 });
    }, [tableRef, waitForPage]);

    useEffect(() => {
        dispatch({
            type: ActionKind.CountChange,
            payload: { pageCount: itemsCount }
        });
    }, [itemsCount]);

    const goToPage = useCallback(
        (page: number, bypassScrollTop?: boolean) => {
            dispatch({
                type: ActionKind.PageChange,
                payload: { page }
            });
            !bypassScrollTop && tableRef?.current?.scrollTo({ top: 0 });
        },
        [tableRef]
    );
    const onSearch = useCallback((search: string, page: number) => {
        dispatch({
            type: ActionKind.SearchChange,
            payload: { search, page }
        });
    }, []);
    const onSort = useCallback((sort: State["sort"]) => {
        dispatch({
            type: ActionKind.SortChange,
            payload: { sort }
        });
    }, []);
    const forceSetLoading = useCallback(() => {
        dispatch({
            type: ActionKind.ForceLoading
        });
    }, []);
    const getThProps = useCallback(
        (column: Column<DType>) => {
            const sort = state.sort;
            const id = column?.id ?? String(column.accessor);
            const isColumnSorted = sort === id || sort?.substring(1) === id;

            const sortIndex = isColumnSorted
                ? sort?.substring(0, 1) === "-"
                    ? -1
                    : 1
                : undefined;
            const handleSort = column.canSort
                ? () => {
                      onSort(sortIndex === 1 ? `-${id}` : `${id}`);
                  }
                : undefined;

            return {
                key: `${tableId}-${column.accessor}-${column.id ?? ""}`,
                handleSort,
                sorted: isColumnSorted,
                sortIndex
            };
        },
        [onSort, state.sort, tableId]
    );
    const getTdProps = useCallback(
        (column: Column<DType>) => ({
            key: `${tableId}-${column.accessor}-${column.id ?? ""}`
        }),
        [tableId]
    );

    return {
        state,
        goToPage,
        paginationVisibility: data.length > 0,
        getThProps,
        getTdProps,
        forceSetLoading,
        setSort: onSort,
        setSearch: onSearch
    };
};
