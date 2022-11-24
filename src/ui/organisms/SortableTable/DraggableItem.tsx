import { FC } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { getGridTemplate } from '../Table/helpers';
import { Column } from '../Table/types';

interface DraggableItemProps<DType extends object> {
    columns: Column<DType>[];
    row: DType;
    index: number;
    onRowClick: (row: DType) => void;
    getTdProps: (column: Column<DType>) => {
        key: string;
    },
}

interface TdProps {}

export const DraggableItem = <DType extends Record<string, any>>({
    columns,
    row,
    index,
    onRowClick,
    getTdProps
}: DraggableItemProps<DType>) => {
    const Td: FC<TdProps> = ({ children }) => (
        <span
            className={`inline-flex items-center py-17p px-10p first:pl-5 z-10 whitespace-nowrap text-dark-main text-14 leading-5 text-left relative border-b border-gray-bg overflow-hidden `}
        >
            {children}
        </span>
    );
    return (
        <Draggable
        key={row?._id}
        draggableId={row?._id}
        index={index}
    >
        {(provided, snapshot) => (
            <div
                key={`${index}`}
                onClick={() =>
                    onRowClick(row)
                }
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
                <span
                    className="grid auto-rows-min group"
                    style={{
                        gridTemplateColumns: getGridTemplate(
                            columns
                        )
                    }}
                >
                    {columns.map(column => (
                        <Td
                            {...getTdProps(
                                column
                            )}
                        >
                            {column.Cell
                                ? column.Cell(
                                      {
                                          cell: row[column.accessor],
                                          row,
                                          index: index + 1
                                      }
                                  )
                                : row[column.accessor]
                            }
                        </Td>
                    ))}
                </span>
            </div>
        )}
    </Draggable>
    );
};