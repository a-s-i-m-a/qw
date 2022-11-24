import { useCallback, useRef } from "react";
import ReactPaginate from "react-paginate";
import { Td } from "../../atoms/Td";
import { Th } from "../../atoms/Th";
import { EmptyState as DefaultEmptyState } from "./EmptyState";
import { Spinner } from "../../atoms/Spinner";
import { DropdownArrow } from "../../atoms/Icon";
import { useTableStateSaver } from "./useTableStateSaver";
import { useTable } from "./useTable";
import { getGridTemplate } from "./helpers";
import { Column } from "./types";
import cn from "classnames";
import { useEffect } from "react";
import { createContext } from "react";
import { RefObject } from "react";
import { useImperativeHandle } from "react";

interface TableProps<DType extends object> {
    columns: Column<DType>[];
    className?: string;
    tableClassName?: string;
    disablePagination?: boolean;
    CustomEmptyState?: () => JSX.Element | null;
    handleRowClick?: (row: DType) => void;
    sortedColumn?: string;
    id: string;
    tableRef?: RefObject<TableControls>;
    fetch: ({
        pageIndex,
        sort,
        debounce,
        ...rest
    }: {
        [key: string]: unknown;
        pageIndex: number;
        sort?: string | undefined;
        debounce?: boolean | undefined;
    }) => void;
    data: DType[];
    pageCount: number;
    isLoading: boolean;
    withoutHeader?: boolean;
    search?: string;
}

export interface TableControls {
    refetch: () => void;
    scrollRef: RefObject<HTMLDivElement> | null;
}

export const TableContext = createContext<TableControls>({
    refetch: () => undefined,
    scrollRef: null
});
export const Table = <DType extends Record<string, any>>({
    columns,
    className = "",
    disablePagination,
    CustomEmptyState: EmptyState = DefaultEmptyState,
    handleRowClick,
    sortedColumn,
    tableClassName,
    id,
    tableRef,
    data,
    isLoading,
    withoutHeader,
    pageCount,
    fetch,
    search
}: TableProps<DType>) => {
    const ref = useRef<HTMLTableElement>(null);

    const {
        goToPage,
        setSort,
        getThProps,
        getTdProps,
        forceSetLoading,
        setSearch,
        paginationVisibility,
        state
    } = useTable<DType>({
        data,
        itemsCount: pageCount,
        waitForPage: true,
        id,
        forceSort: sortedColumn,
        tableRef: ref
    });

    // const compareRef = usePrevious<TableProps<DType>["extraArgs"]>(extraArgs);
    useEffect(() => {
        if (search !== undefined) {
            setSearch(search, 0)
        }
    }, [goToPage, search, setSearch])

    useEffect(() => {
        if (id) {
            goToPage(0)
        }
    }, [goToPage, id])

    useEffect(() => {
        if (state.page !== undefined) {
            // const debounce =
            //     compareRef.current.cur?.search !==
            //     compareRef.current.prev?.search;

            // debounce && forceSetLoading();
            // TODO делает второй запрос из-за того, что при смене id нам нужно сбросить sort
            // но этот эффект выполняется быстрее. сейчас вызывается сначала со старым, потом с новым
            fetch({
                pageIndex: state.page,
                search: state.search,
                ...(state.sort ? { sort: state.sort } : {})
            });
        }
    }, [fetch, forceSetLoading, setSort, sortedColumn, state.page, state.search, state.sort]);

    const { saveState } = useTableStateSaver({
        id,
        currentPage: state.page,
        goToPage,
        ref
    });

    const handlePageChange = useCallback(
        ({ selected }: { selected: number }) => {
            goToPage(selected);
            saveState();
        },
        [goToPage, saveState]
    );

    const onRowClick = (row: DType) => {
        saveState();
        handleRowClick && handleRowClick(row);
    };

    const wrapperClasses = cn(
        "flex flex-col flex-1",
        className
    );
    const tableClasses = cn(
        "grid auto-rows-min",
        {
            "flex-1": disablePagination
        },
        tableClassName
    );

    const refetch = useCallback(
        (page?: number) => {
            fetch({
                pageIndex: page ?? state.page!,
                search: state.search,
                ...(state.sort ? { sort: state.sort } : {})
            });
        },
        [fetch, state.page, state.search, state.sort]
    );

    useImperativeHandle(tableRef, () => ({
        refetch,
        scrollRef: ref
    }));
    return (
        <TableContext.Provider value={{ refetch, scrollRef: ref }}>
            <section className={wrapperClasses}>
                <table
                    ref={ref}
                    className={tableClasses}
                    style={{
                        gridTemplateColumns: getGridTemplate(columns)
                    }}
                >
                    {!withoutHeader && (
                        <thead className="contents">
                            <tr className="group contents">
                                {columns.map(column => (
                                    <Th {...getThProps(column)}>
                                        {column.Header}
                                    </Th>
                                ))}
                            </tr>
                        </thead>
                    )}
                    {!isLoading && (
                        <tbody className="contents">
                            {data.map((row, index) => (
                                <tr
                                    key={`${id}-${index}`}
                                    className={`group contents ${
                                        handleRowClick ? "cursor-pointer" : ""
                                    } `}
                                    onClick={() => onRowClick(row)}
                                >
                                    {columns.map(column => (
                                        <Td {...getTdProps(column)}>
                                            {column.Cell
                                                ? column.Cell({
                                                      cell:
                                                          row[column.accessor],
                                                      row
                                                  })
                                                : row[column.accessor]}
                                        </Td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>

                {data.length === 0 && !isLoading && <EmptyState />}

                {isLoading && (
                    <section
                        className={`flex flex-1 ${
                            disablePagination ? "h-96" : "flex-1 "
                        }  items-center justify-center`}
                    >
                        <Spinner />
                    </section>
                )}

                {!disablePagination && paginationVisibility && (
                    <section className={`pt-10p pl-50p pb-60p bg-white z-100 fixed left-60 bottom-0 right-5 ${tableClassName}`}>
                        <ReactPaginate
                            previousLabel={
                                <DropdownArrow className="transform -rotate-90 " />
                            }
                            nextLinkClassName="w-30p h-30p flex items-center justify-center"
                            previousLinkClassName="w-30p h-30p flex items-center justify-center mr-6p"
                            nextLabel={
                                <DropdownArrow className="transform rotate-90" />
                            }
                            disabledClassName="text-gray-main"
                            forcePage={state.page}
                            breakLabel={"..."}
                            breakClassName={
                                "w-30p h-30p inline-flex items-center justify-center mr-6p"
                            }
                            pageCount={state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={2}
                            onPageChange={handlePageChange}
                            containerClassName="flex items-center"
                            activeClassName={
                                "text-white bg-purple-main rounded-full"
                            }
                            pageClassName="mr-6p"
                            pageLinkClassName="font-normal text-14 tracking-5 w-30p h-30p inline-flex items-center justify-center outline-none focus:outline-none"
                        />
                    </section>
                )}
            </section>
        </TableContext.Provider>
    );
};
