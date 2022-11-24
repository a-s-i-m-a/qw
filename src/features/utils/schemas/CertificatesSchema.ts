import { TFunction } from "i18next";
import Joi from "joi";

export const getAddLevelSchema = (t: TFunction) =>
    Joi.object({
        name: Joi.string()
            .required()
            .max(50)
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired"),
                "string.max": t("maxStringLength", { number: 50 })
            }),
        description: Joi.string()
            .required()
            .max(125)
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired"),
                "string.max": t("maxStringLength", { number: 125 })
            }),
        sortNumber: Joi.number()
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired"),
                "number.empty": t("fieldIsRequired"),
                "number.base": t("fieldIsRequired")
            })
    }).unknown();

export const getAddCertificateSchema = (t: TFunction) =>
    Joi.object({
        country: Joi.object({
            label: Joi.string().required(),
            value: Joi.string().required()
        })
            .required()
            .unknown()
    }).unknown();

export const getEditBlockSchema = (t: TFunction) =>
    Joi.object({
        name: Joi.string()
            .required()
            .max(50)
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired"),
                "string.max": t("maxStringLength", { number: 50 })
            }),
        sortNumber: Joi.number()
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired"),
                "number.empty": t("fieldIsRequired"),
                "number.base": t("fieldIsRequired")
            })
    }).unknown();

const AnswerSchema = Joi.array()
    .items(
        Joi.object({
            text: Joi.string().required(),
            isCorrect: Joi.boolean()
        }).unknown()
    )
    .required();

const QuestionArraySchema = Joi.array()
    .items(
        Joi.object()
            .keys({
                question: Joi.string().required(),
                answers: AnswerSchema,
                correctAnswer: Joi.string()
            })
            .unknown()
    )
    .min(1);

export const getLessonSchema = (t: TFunction) =>
    Joi.object({
        name: Joi.string()
            .required()
            .max(50)
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired"),
                "string.max": t("maxStringLength", { number: 50 })
            }),
        sortNumber: Joi.number()
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired"),
                "number.empty": t("fieldIsRequired"),
                "number.base": t("fieldIsRequired")
            }),
        quiz: Joi.object({
            questions: Joi.object({
                default: QuestionArraySchema
            }).required()
        })
            .required()
            .unknown(),
        video: Joi.alternatives()
            .try(Joi.object(), Joi.string())
            .required()
            .messages({
                "any.required": t("certificate.videoRequired")
            })
    }).unknown();

export const getBonusLessonSchema = (t: TFunction) =>
    Joi.object({
        name: Joi.string()
            .required()
            .max(50)
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired"),
                "string.max": t("maxStringLength", { number: 50 })
            }),
        sortNumber: Joi.number()
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired"),
                "number.empty": t("fieldIsRequired"),
                "number.base": t("fieldIsRequired")
            }),
        video: Joi.alternatives()
            .try(Joi.object(), Joi.string())
            .required()
            .messages({
                "any.required": t("certificate.videoRequired")
            })
    }).unknown();
