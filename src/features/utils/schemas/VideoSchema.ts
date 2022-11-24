import { TFunction } from "i18next";
import Joi from "joi";
import { VideoPayload } from "../../videos/types";

const AnswerSchema = Joi.array()
    .items(
        Joi.object({
            text: Joi.string().required(),
            isCorrect: Joi.boolean().required()
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

const getLinkSchema = (t: TFunction) =>
    Joi.string()
        .allow(null)
        .messages({
            "string.empty": t("fieldIsRequired"),
            "any.required": t("fieldIsRequired")
        });

export const getVideoSchema = (t: TFunction) =>
    Joi.object<VideoPayload>({
        expert: Joi.object({
            label: Joi.string()
                .required()
                .messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                }),
            value: Joi.string()
                .required()
                .messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                })
        })
            .required()
            .messages({
                "any.required": t("fieldIsRequired")
            })
            .unknown(),
        productId: Joi.object({
            label: Joi.string()
                .required()
                .messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                }),
            value: Joi.string()
                .required()
                .messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                })
        })
            .required()
            .messages({
                "any.required": t("fieldIsRequired")
            })
            .unknown(),
        links: Joi.object({
            ru: getLinkSchema(t),
            en: getLinkSchema(t),
            it: getLinkSchema(t)
        })
            .or("ru", "en", "it")
            .required(),
        quiz: Joi.object({
            questions: Joi.object({
                ru: QuestionArraySchema,
                en: QuestionArraySchema,
                it: QuestionArraySchema
            })
                .or("ru", "en", "it")
                .required()
        }).unknown()
    })
        .when(
            Joi.object({
                links: Joi.object({
                    it: Joi.exist().not(null)
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    quiz: Joi.object({
                        questions: Joi.object({
                            it: Joi.required()
                        }).unknown()
                    })
                })
            }
        )
        .when(
            Joi.object({
                quiz: Joi.object({
                    questions: Joi.object({ it: Joi.exist() }).unknown()
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    links: Joi.object({
                        it: Joi.string().required()
                    })
                })
            }
        )

        .when(
            Joi.object({
                links: Joi.object({
                    ru: Joi.exist().not(null)
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    quiz: Joi.object({
                        questions: Joi.object({
                            ru: Joi.required()
                        }).unknown()
                    })
                })
            }
        )
        .when(
            Joi.object({
                quiz: Joi.object({
                    questions: Joi.object({ ru: Joi.exist() }).unknown()
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    links: Joi.object({
                        ru: Joi.string().required()
                    })
                })
            }
        )

        .when(
            Joi.object({
                links: Joi.object({
                    en: Joi.exist().not(null)
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    quiz: Joi.object({
                        questions: Joi.object({
                            en: Joi.required()
                        }).unknown()
                    })
                })
            }
        )
        .when(
            Joi.object({
                quiz: Joi.object({
                    questions: Joi.object({ en: Joi.exist() }).unknown()
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    links: Joi.object({
                        en: Joi.string().required()
                    })
                })
            }
        )
        .unknown(true);
