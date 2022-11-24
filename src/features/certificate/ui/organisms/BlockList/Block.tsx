import React, { FC, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { ArrowUpIcon } from "../../../../../ui/atoms/Icon";
import { Lesson, LessonBlock } from "../../../../types";
import { PoppedMoreBlocks } from "../../molecules/PoppedMoreBlocks";
import { Lessons } from "./Lessons";

interface BlockProps {
    block: LessonBlock;
    index: number;
    handleLessonClick: (data: Lesson, blockId: string) => void;
}

export const Blocks: FC<BlockProps> = ({ block, index, handleLessonClick }) => {
    const [visible, setVisible] = useState(false);
    return (
        <Draggable key={block._id} draggableId={block._id} index={index}>
            {(provided, snapshot) => (
                <div>
                    <li ref={provided.innerRef} {...provided.draggableProps}>
                        <div
                            className={`flex flex-row items-center h-66p z-10 whitespace-nowrap 
              text-dark-main text-14 leading-5 text-left relative border-b border-gray-bg 
              overflow-hidden px-10p`}
                        >
                            {block?.lessons?.length ? (
                                <span
                                    className={`w-46p h-46p flex items-center justify-center cursor-pointer ${
                                        visible ? "" : "transform rotate-90"
                                    }`}
                                    onClick={e => setVisible(v => !v)}
                                >
                                    <ArrowUpIcon />
                                </span>
                            ) : (
                                <span className="w-46p"></span>
                            )}
                            <span className={`w-50p text-start`}>
                                {block.sortNumber + 1}
                            </span>
                            <span
                                className="w-full h-full flex items-center"
                                {...provided.dragHandleProps}
                            >
                                {block.name}
                            </span>
                            <span className="w-46p text-center">
                                <PoppedMoreBlocks item={block} />
                            </span>
                        </div>
                        <Droppable
                            droppableId={block._id}
                            type={`droppableLesson`}
                        >
                            {(provided, snapshot) => (
                                <ul
                                    className="flex flex-col"
                                    ref={provided.innerRef}
                                >
                                    {visible &&
                                        block.lessons &&
                                        block.lessons
                                            .map((item, index) => (
                                                <Lessons
                                                    key={index}
                                                    lesson={item}
                                                    index={index}
                                                    block={block}
                                                    handleLessonClick={
                                                        handleLessonClick
                                                    }
                                                />
                                            ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </li>
                </div>
            )}
        </Draggable>
    );
};
