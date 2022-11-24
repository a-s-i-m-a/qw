import { addCorrectAnswerField } from "../../articles/utils/transformArticles";
import { BonusLesson, Lesson } from "./../../types";

export const transformBonusLesson = (lessons: BonusLesson[] | undefined) => {
    if (lessons) {
        const lessonPayload = lessons.map(item => {
            if (item.video && !(item.video instanceof File)) {
                item.videoId = item.video._id;
                return item;
            }
            return item;
        });

        return lessonPayload;
    } else {
        return [];
    }
};

export const transformLesson = (lesson: Lesson) => {
    return {
        ...lesson,
        quiz: lesson?.quiz
            ? {
                  ...lesson.quiz,
                  questions: lesson.quiz.questions
                      ? {
                            default: lesson.quiz.questions.default
                                ? addCorrectAnswerField(
                                    lesson.quiz.questions.default
                                  )
                                : [],
                        }
                      : undefined
              }
            : {
                  questions: {
                      default: [],
                  }
              },
    }
};
