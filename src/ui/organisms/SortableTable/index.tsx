import { useCallback, useRef, useEffect } from "react";
import ReactPaginate from "react-paginate";

import { Th } from "../../atoms/Th";
import { EmptyState as DefaultEmptyState } from "../Table/EmptyState";
import { Spinner } from "../../atoms/Spinner";
import { DropdownArrow } from "../../atoms/Icon";
import { useTableStateSaver } from "../Table/useTableStateSaver";
import { useTable } from "../Table/useTable";
import { getGridTemplate } from "../Table/helpers";
import { Column } from "../Table/types";
import cn from "classnames";
import { createContext } from "react";
import { RefObject } from "react";
import {
    DragDropContext,
    Droppable,
    DropResult
} from "react-beautiful-dnd";
import { DraggableItem } from "./DraggableItem";

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
    data: DType[];
    pageCount: number;
    isLoading: boolean;
    withoutHeader?: boolean;
    onDragEnd: (result: DropResult) => void;
    setSort?: (value: string | null) => void;
}

export interface TableControls {
    scrollRef: RefObject<HTMLDivElement> | null;
}

export const TableContext = createContext<TableControls>({
    scrollRef: null
});
export const SortableTable = <DType extends Record<string, any>>({
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
    onDragEnd,
    setSort
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

    useEffect(() => {
        setSort && setSort(state?.sort)
    })

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

    const wrapperClasses = cn("flex flex-col flex-1 h-3/4", className);
    const tableClasses = cn("grid auto-rows-min", tableClassName);

    return (
        <TableContext.Provider value={{ scrollRef: ref }}>
            <section className={wrapperClasses}>
                <table ref={ref}>
                    {!withoutHeader && (
                        <thead
                            className={tableClasses}
                            style={{
                                gridTemplateColumns: getGridTemplate(columns)
                            }}
                        >
                            <tr className="group contents">
                                {columns.map(column => (
                                    <Th {...getThProps(column)}>
                                        {column.Header}
                                    </Th>
                                ))}
                            </tr>
                        </thead>
                    )}
                </table>
                {!isLoading && (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable
                            droppableId="droppable"
                            type="droppableBlock"
                        >
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}>
                                    {data.map((row, index) => (
                                        <DraggableItem
                                            key={row?._id}
                                            columns={columns}
                                            row={row}
                                            index={index}
                                            onRowClick={onRowClick}
                                            getTdProps={getTdProps}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}

                {data.length === 0 && !isLoading && <EmptyState />}

                {isLoading && (
                    <section
                        className={`flex ${
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
