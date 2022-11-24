import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Spinner } from "../../../../../ui/atoms/Spinner";
import { Lesson, LessonBlock } from "../../../../types";
import { CertificatesAPI } from "../../../../utils/api/requests/certificates-requests";
import { EmptyCertificates } from "../../atoms/EmptyCertificates";
import { Blocks } from "./Block";
import { Header } from "./Header";
import { reorder } from "./helper";

export interface BlockListProps {
    data: { items: LessonBlock[] } | null;
    setData: (list: { items: LessonBlock[] } | null) => void;
    isLoading?: boolean;
    handleLessonClick: (data: Lesson, blockId: string) => void;
}

export const BlockList: FC<BlockListProps> = observer(
    ({ data, setData, isLoading, handleLessonClick }) => {
        const onDragEnd = async (result: DropResult) => {
            if (!result.destination) {
                return;
            }
            const sourceIndex = result.source.index;
            const destIndex = result.destination.index;

            if (result.type === "droppableBlock" && data) {
                const items = reorder(data.items, sourceIndex, destIndex);
                setData({ items: items });
                await CertificatesAPI.updateBlock({
                    id: result.draggableId,
                    formData: { sortNumber: result.destination.index }
                });
            } else if (result.type === "droppableLesson" && data) {
                const itemSubItemMap = data.items.reduce((acc: any, item) => {
                    acc[item._id] = item.lessons;
                    return acc;
                }, {});

                const sourceParentId = result.source.droppableId;
                const destParentId = result.destination.droppableId;

                const sourceSubItems = itemSubItemMap[sourceParentId];

                let newItems = [...data.items];

                /** In this case subItems are reOrdered inside same Parent */
                if (sourceParentId === destParentId) {
                    const reorderedSubItems = reorder(
                        sourceSubItems,
                        sourceIndex,
                        destIndex
                    );
                    newItems = newItems.map(item => {
                        if (item._id === sourceParentId) {
                            item.lessons = reorderedSubItems;
                        }
                        return item;
                    });
                    setData({ items: newItems });
                    await CertificatesAPI.updateLesson({
                        id: result.draggableId,
                        formData: { sortNumber: result.destination.index }
                    });
                } 
            }
        };

        return (
            <>
                <Header />
                {!isLoading && data?.items?.length ? (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable
                            droppableId="droppable"
                            type="droppableBlock"
                        >
                            {(provided, snapshot) => (
                                <ul
                                    className="flex flex-col pb-83p h-full overflow-y-auto"
                                    ref={provided.innerRef}
                                >
                                    {data?.items
                                        .map((item, index) => (
                                            <Blocks
                                                block={item}
                                                index={index}
                                                key={item._id}
                                                handleLessonClick={
                                                    handleLessonClick
                                                }
                                            />
                                        ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                ) : isLoading || !data ? (
                    <section className="flex items-center justify-center h-full w-full">
                        <Spinner />
                    </section>
                ) : (
                    <EmptyCertificates page="blocks" />
                )}
            </>
        );
    }
);
