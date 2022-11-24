import { TFunction } from "i18next";
import Joi from "joi";
import { ReviewExpertPayload } from "../../reviews/types";
import { Tastes } from "../../types";

const getTastes = (t: TFunction) =>
    Joi.object({
        label: Joi.string()
            .required()
            .messages({
                "string.empty": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired")
            }),
        value: Joi.string()
            .valid(...Tastes)
            .required()
            .messages({
                "string.empty": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired"),
                "any.valid": t("fieldIsRequired")
            })
    })
        .required()
        .messages({
            "any.required": t("fieldIsRequired")
        });

const getNumberJoi = (t: TFunction, min: number, max: number) =>
    Joi.number()
        .integer()
        .min(min)
        .max(max)
        .required()
        .messages({
            "number.min": t("minValue", {
                value: min
            }),
            "number.max": t("maxValue", {
                value: max
            }),
            "number.base": t("fieldIsRequired"),
            "string.empty": t("fieldIsRequired"),
            "any.required": t("fieldIsRequired")
        });

const getLangMap = (t: TFunction) =>
    Joi.object()
        .keys({
            ru: Joi.string().messages({
                "string.empty": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired")
            }),
            en: Joi.string().messages({
                "string.empty": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired")
            }),
            it: Joi.string().messages({
                "string.empty": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired")
            })
        })
        .or("ru", "en", "it")
        // .required()
        .messages({
            "any.required": t("fieldIsRequired")
        })
        .allow(null);

const getDefaultReviewSchema = (t: TFunction) => ({
    rating: getNumberJoi(t, 0, 100),
    aftertasteDuration: getNumberJoi(t, 1, 15),
    tasteKinds: Joi.object()
        .keys({
            first: getTastes(t),
            second: getTastes(t),
            third: getTastes(t)
        })
        .required()
        .messages({
            "any.required": t("fieldIsRequired")
        }),
    tasteScores: Joi.object()
        .keys({
            body: getNumberJoi(t, 1, 10),
            tannin: getNumberJoi(t, 1, 10),
            sweetness: getNumberJoi(t, 1, 10),
            acidity: getNumberJoi(t, 1, 10)
        })
        .required()
        .messages({
            "any.required": t("fieldIsRequired")
        }),
    expertText: getLangMap(t),
    expertAftertasteDescription: getLangMap(t)
});

const addValidation = (object: Joi.ObjectSchema): Joi.ObjectSchema =>
    object // italian
        .when(
            Joi.object({
                expertText: Joi.object({
                    it: Joi.exist()
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    expertAftertasteDescription: Joi.object({
                        it: Joi.required()
                    })
                })
            }
        )
        .when(
            Joi.object({
                expertAftertasteDescription: Joi.object({
                    it: Joi.exist()
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    expertText: Joi.object({
                        it: Joi.required()
                    })
                })
            }
        )
        // russian
        .when(
            Joi.object({
                expertText: Joi.object({
                    ru: Joi.exist()
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    expertAftertasteDescription: Joi.object({
                        ru: Joi.required()
                    })
                })
            }
        )
        .when(
            Joi.object({
                expertAftertasteDescription: Joi.object({
                    ru: Joi.exist()
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    expertText: Joi.object({
                        ru: Joi.required()
                    })
                })
            }
        )
        // english
        .when(
            Joi.object({
                expertText: Joi.object({
                    en: Joi.exist()
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    expertAftertasteDescription: Joi.object({
                        en: Joi.required()
                    })
                })
            }
        )
        .when(
            Joi.object({
                expertAftertasteDescription: Joi.object({
                    en: Joi.exist()
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    expertText: Joi.object({
                        en: Joi.required()
                    })
                })
            }
        )
        .unknown(true);

export const getAdminReviewSchema = (t: TFunction) =>
    addValidation(
        Joi.object({
            user: Joi.object({
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
            }).messages({
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
            ...getDefaultReviewSchema(t)
        }).or("expert", "user")
    );

export const getExpertReviewSchema = (t: TFunction) =>
    addValidation(
        Joi.object<ReviewExpertPayload>({
            text: Joi.string()
                .required()
                .messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                }),
            aftertasteDescription: Joi.string()
                .required()
                .messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                }),
            ...getDefaultReviewSchema(t)
        })
    );
