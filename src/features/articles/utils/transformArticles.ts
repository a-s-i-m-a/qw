import { langTabs } from "../../../ui/organisms/LanguageTabChanger";
import { ArticlePayload } from "../types";
import { Article, Languages, Question } from "./../../types";

export const addCorrectAnswerField = (questions: Question[]) =>
    questions.map(question => ({
        ...question,
        correctAnswer: question.answers
            .findIndex(answer => answer.isCorrect === true)
            .toString()
    }));

export const transformArticles = (
    article: Article,
    language?: Languages
): Partial<ArticlePayload> => {
    return {
        ...article,
        manufacturer: {
            label: article.manufacturer?.name,
            value: article.manufacturer?._id
        },
        description: article.description ?? "",
        cover: article?.coverId || article?.cover,
        blocks: article?.blocks
            ? {
                  ru: article?.blocks?.ru || [],
                  en: article?.blocks?.en || [],
                  it: article?.blocks?.it || [],
              } : {
                  ru: [],
                  en: [],
                  it: []
              },
        quiz: article?.quiz
            ? {
                  ...article.quiz,
                  questions: article.quiz.questions
                      ? {
                            ru: article.quiz.questions.ru
                                ? addCorrectAnswerField(
                                      article.quiz.questions.ru
                                  )
                                : [],
                            en: article.quiz.questions.en
                                ? addCorrectAnswerField(
                                      article.quiz.questions.en
                                  )
                                : [],
                            it: article.quiz.questions.it
                                ? addCorrectAnswerField(
                                      article.quiz.questions.it
                                  )
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
        currentLang: language 
        ? langTabs.find(lang => lang.value === language) 
        : langTabs.find(lang => lang.value === "en")!
    };
};

export const transformPayload = (
    values: Partial<ArticlePayload>
): Partial<Article> => {
    return {
        manufacturerId: values?.manufacturer?.value,
        coverId: values?.coverId,
        description: values?.description,
        blocks: values?.blocks,
        quiz: values?.quiz
    };
};
