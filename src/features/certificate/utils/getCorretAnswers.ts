import { Quiz } from "../../types";

export const getCorrectAnswers = (quiz: Quiz) => {
    const newQuiz = quiz.questions.default?.map(question => {
        const newAnswers = question.answers.filter((answer: any) => answer.hasOwnProperty("isCorrect"))
        question.answers = newAnswers
        return question
    })
    return newQuiz
}