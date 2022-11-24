import axios from "axios";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import { ListResponse } from "../../../features/types";
import { translator } from "../../../features/utils/i18n";
import { throwErrorToast } from "../Toaster";
import { PageOptions } from "./types";

let tableCache: Record<string, object> = {};

interface ControllerProps<
    ItemType extends object,
    OType extends object = PageOptions
> {
    fetchFn: (params: OType) => Promise<ListResponse<ItemType>>;
    pageSize?: number;
    id: string;
    extraArgs?: Omit<OType, "limit" | "skip" | "sort">;
}

interface State<DType extends object> {
    data: DType[];
    pageCount: number;
    itemsCount: number;
    isLoading: boolean;
    isFetching: boolean;
}

enum ActionKind {
    LoadingChange = "LOADINGCHANGE",
    IdChange = "IDCHANGE",
    FetchDone = "FETCHDONE"
}

type Action<DType extends object> =
    | {
          type: ActionKind.FetchDone;
          payload: State<DType>;
      }
    | {
          type: ActionKind.LoadingChange;
          payload: boolean;
      }
    | {
          type: ActionKind.IdChange;
      };

const reducer = <DType extends object>(
    state: State<DType>,
    action: Action<DType>
) => {
    switch (action.type) {
        case ActionKind.FetchDone:
            return {
                ...state,
                ...action.payload
            };

        case ActionKind.LoadingChange:
            return {
                ...state,
                isLoading: action.payload
            };
        case ActionKind.IdChange:
            return {
                ...state,
                isLoading: true,
                data: []
            };

        default:
            return state;
    }
};
export const useTableFetch = <
    DType extends object,
    PType extends PageOptions = PageOptions
>({
    fetchFn,
    pageSize = 20,
    id
}: ControllerProps<DType, PType>) => {
    const [state, dispatch] = useReducer<
        (state: State<DType>, action: Action<DType>) => State<DType>
    >(reducer, {
        data: [],
        pageCount: 1,
        isLoading: true,
        itemsCount: 0,
        isFetching: true
    });

    useEffect(() => {
        dispatch({
            type: ActionKind.IdChange
        });
    }, [id]);

    const handleNewData = useCallback(
        ({
            pageSize,
            data,
            isFetchingDone = false
        }: {
            data: ListResponse<DType>;
            pageSize: number;
            isFetchingDone?: boolean;
        }) => {
            const { items, totalCount } = data;
            dispatch({
                type: ActionKind.FetchDone,
                payload: {
                    isLoading: false,
                    data: items,
                    pageCount: Math.ceil(totalCount / pageSize),
                    itemsCount: totalCount,
                    isFetching: !isFetchingDone
                }
            });
        },
        []
    );

    const fetchData = useCallback(
        async ({
            cacheId,
            pageIndex,
            pageSize,
            sort,
            ...rest
        }: {
            pageIndex: number;
            pageSize: number;
            cacheId: string;
            sort?: string;
        }) => {
            const fetchData = await fetchFn({
                skip: pageIndex * pageSize,
                limit: pageSize,
                sort,
                ...rest
            } as PType);

            try {
                handleNewData({
                    data: fetchData,
                    pageSize,
                    isFetchingDone: true
                });
                tableCache = { ...tableCache, [cacheId]: fetchData };
            } catch (e) {
                translator.then(function (t) {
                    !axios.isCancel(e) &&
                        throwErrorToast(t("error"), t("unknownError"));
                });
            }
        },
        [fetchFn, handleNewData]
    );

    const debouncedFetch = useMemo(
        () =>
            debounce(fetchData || (() => undefined), 750, {
                leading: true
            }),
        [fetchData]
    );
    const fetch = useCallback(
        ({
            pageIndex,
            sort,
            debounce,
            ...rest
        }: {
            pageIndex: number;
            sort?: string;
            [key: string]: unknown;
            debounce?: boolean;
        }) => {
            const cacheId = `${id}-${pageIndex}-${pageSize}-${sort}-${Object.entries(
                rest
            )
                .map(arg => `${arg[0]}-${arg[1]}`)
                .join("-")}`;
            const cache = tableCache[cacheId] as ListResponse<DType>;

            if (cache) {
                handleNewData({ data: cache, pageSize });
                dispatch({
                    type: ActionKind.LoadingChange,
                    payload: false
                });
            } else {
                dispatch({
                    type: ActionKind.LoadingChange,
                    payload: true
                });
            }

            const fn = !debounce ? fetchData : debouncedFetch;
            fn({ pageIndex, pageSize, cacheId, sort, ...rest });
        },
        [fetchData, handleNewData, debouncedFetch, id, pageSize]
    );
    const setLoading = () => {
        dispatch({
            type: ActionKind.LoadingChange,
            payload: true
        });
    };
    return {
        ...state,
        fetch,
        setLoading
    };
};
