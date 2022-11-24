import { Languages } from './../../types';
import { langTabs } from "../../../ui/organisms/LanguageTabChanger";
import { Question, Video } from "../../types";
import { VideoPayload } from "../types";

const addCorrectAnswerField = (questions: Question[]) =>
    questions.map(question => ({
        ...question,
        correctAnswer: question.answers
            .findIndex(answer => answer.isCorrect === true)
            .toString()
    }));

export const transformVideo = (video: Video, language?: Languages): Partial<VideoPayload> => {
    return {
        expert: video.expert
            ? { label: video.expert.name, value: video.expert._id }
            : undefined,
        quiz: video?.quiz
            ? {
                  ...video.quiz,
                  questions: video.quiz.questions
                      ? {
                            ru: video.quiz.questions.ru
                                ? addCorrectAnswerField(video.quiz.questions.ru)
                                : [],
                            en: video.quiz.questions.en
                                ? addCorrectAnswerField(video.quiz.questions.en)
                                : [],
                            it: video.quiz.questions.it
                                ? addCorrectAnswerField(video.quiz.questions.it)
                                : []
                        }
                      : undefined
              }
            : {
                  questions: {
                      ru: [],
                      en: [],
                      it: []
                  }
              },
        links: video?.links ?? {
            ru: "",
            en: "",
            it: ""
        },
        currentLang: language 
        ? langTabs.find(lang => lang.value === language) 
        : langTabs.find(lang => lang.value === "en")!,
        productId: video.product
            ? {
                  label: video.product.name,
                  value: video.product._id
              }
            : undefined,
        _id: video._id
    };
};

export const transformVideoPayload = (values: VideoPayload): Partial<Video> => {
    return {
        expertId: values.expert?.value,
        links: Object.fromEntries(
            Object.entries(values.links).filter(entry => entry[1] !== null)
        ),
        quiz: values.quiz,
        productId: values.productId?.value,
        _id: values._id
    };
};
