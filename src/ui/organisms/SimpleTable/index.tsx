import { useCallback, useRef } from "react";
import ReactPaginate from "react-paginate";

import { Td } from "../../atoms/Td";
import { Th } from "../../atoms/Th";
import { EmptyState } from "../Table/EmptyState";
import cn from "classnames";
import { createContext } from "react";
import { RefObject } from "react";
import { Column } from "../Table/types";
import { useTable } from "../Table/useTable";
import { useTableStateSaver } from "../Table/useTableStateSaver";
import { getGridTemplate } from "../Table/helpers";
import { DropdownArrow } from "../../atoms/Icon";
import { Spinner } from "../../atoms/Spinner";

interface TableProps<DType extends object> {
    columns: Column<DType>[];
    className?: string;
    tableClassName?: string;
    disablePagination?: boolean;
    CustomEmptyState?: () => JSX.Element | null;
    handleRowClick?: (row: DType) => void;
    sortedColumn?: string;
    id: string;
    data: DType[];
    pageCount: number;
    isLoading: boolean;
}

export interface TableControls {
    scrollRef: RefObject<HTMLDivElement> | null;
}

export const TableContext = createContext<TableControls>({
    scrollRef: null
});
export const Table = <DType extends Record<string, any>>({
    columns,
    className = "",
    disablePagination,
    handleRowClick,
    sortedColumn,
    tableClassName,
    id,
    data,
    isLoading,
    pageCount
}: TableProps<DType>) => {
    const ref = useRef<HTMLTableElement>(null);

    const {
        goToPage,
        getThProps,
        getTdProps,
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
        "flex flex-col flex-1 overflow-y-auto",
        className
    );
    const tableClasses = cn(
        "grid overflow-y-auto auto-rows-min",
        {
            "flex-1": disablePagination
        },
        tableClassName
    );

    return (
        <TableContext.Provider value={{ scrollRef: ref }}>
            <section className={wrapperClasses}>
                <table
                    ref={ref}
                    className={tableClasses}
                    style={{
                        gridTemplateColumns: getGridTemplate(columns)
                    }}
                >
                    <thead className="contents">
                        <tr className="group contents">
                            {columns.map(column => (
                                <Th {...getThProps(column)}>{column.Header}</Th>
                            ))}
                        </tr>
                    </thead>
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
                    <section className={`pt-38p mt-auto ${tableClassName}`}>
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
