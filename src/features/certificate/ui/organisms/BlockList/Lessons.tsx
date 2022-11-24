import React, { FC } from "react";
import { Draggable } from "react-beautiful-dnd";
import { PlayIcon } from "../../../../../ui/atoms/Icon";
import { Lesson, LessonBlock } from "../../../../types";
import { PoppedMoreLessons } from "../../molecules/PoppedMoreLessons";

interface LessonsProps {
    lesson: Lesson;
    index: number;
    block: LessonBlock;
    handleLessonClick: (data: Lesson, blockId: string) => void;
}

export const Lessons: FC<LessonsProps> = ({
    lesson,
    index,
    block,
    handleLessonClick
}) => {
    const onRowClick = (e: React.MouseEvent, row: Lesson, blockId: string) => {
        e.stopPropagation();
        if (e.defaultPrevented) {
            return;
        }
        handleLessonClick && handleLessonClick(row, blockId);
    };
    return (
        <Draggable key={lesson._id} draggableId={lesson._id} index={index}>
            {(provided, snapshot) => (
                <div onClick={e => onRowClick(e, lesson, block?._id)}>
                    <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex flex-row items-center h-66p z-10 whitespace-nowrap 
                            text-dark-main text-14 leading-5 text-left relative border-b border-gray-bg 
                            overflow-hidden ml-52p pr-10p`}
                    >
                        <span className={`w-50p text-start`}>{`${
                            block.sortNumber + 1
                        }.${lesson.sortNumber + 1}`}</span>
                        <span
                            className="w-full h-full flex flex-row items-center"
                            {...provided.dragHandleProps}
                        >
                            {lesson?.video && !(lesson?.video instanceof File) && (
                                <a
                                    className="mr-14p focus:outline-none"
                                    href={`${lesson?.video?.url}?sid=${localStorage["sessionId"]}`}
                                    rel="noreferrer"
                                    target="_blank"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <PlayIcon />
                                </a>
                            )}
                            {lesson.name}
                        </span>
                        <span className="w-46p text-center">
                            <PoppedMoreLessons
                                item={lesson}
                                blockId={block?._id}
                            />
                        </span>
                    </li>
                </div>
            )}
        </Draggable>
    );
};
