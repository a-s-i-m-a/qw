import { TFunction } from "i18next";
import Joi from "joi";

const BlocksSchema = Joi.array()
    .items(
        Joi.object({
            type: Joi.string().required(),
            body: Joi.string().allow(null).optional(),
            imageId: Joi.alternatives()
                .try(Joi.object(), Joi.string())
                .allow(null)
                .optional()
        }).unknown()
    );

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
        });

export const getArticlesSchema = (t: TFunction) =>
    Joi.object({
        manufacturer: Joi.object({
            label: Joi.string().required(),
            value: Joi.string().required()
        })
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "any.empty": t("fieldIsRequired")
            })
            .unknown(),
        description: getLangMap(t),
        blocks: Joi.object({
            ru: BlocksSchema,
            en: BlocksSchema,
            it: BlocksSchema
        }),
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
                description: Joi.object({
                    it: Joi.exist().not(null)
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    cover: Joi.object({
                        it: Joi.required()
                    }).unknown(),
                    quiz: Joi.object({
                        questions: Joi.object({
                            it: Joi.required()
                        }).unknown()
                    }),
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
                    cover: Joi.object({
                        it: Joi.required()
                    }).unknown(),
                    description: Joi.object({
                        it: Joi.string().required()
                    }),
                })
            }
        )
        .when(
            Joi.object({
                cover: Joi.object({
                    it: Joi.exist()
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    description: Joi.object({
                        it: Joi.string().required()
                    }),
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
                blocks: Joi.object({
                    it: Joi.exist()
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    cover: Joi.object({
                        it: Joi.required()
                    }).unknown(),
                    description: Joi.object({
                        it: Joi.string().required()
                    }),
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
                description: Joi.object({
                    ru: Joi.exist().not(null)
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    cover: Joi.object({
                        ru: Joi.required()
                    }).unknown(),
                    quiz: Joi.object({
                        questions: Joi.object({
                            ru: Joi.required()
                        }).unknown()
                    }),
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
                    cover: Joi.object({
                        ru: Joi.required()
                    }).unknown(),
                    description: Joi.object({
                        ru: Joi.string().required()
                    }),
                })
            }
        )
        .when(
            Joi.object({
                cover: Joi.object({
                    ru: Joi.exist()
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    description: Joi.object({
                        ru: Joi.string().required()
                    }),
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
                blocks: Joi.object({
                    ru: Joi.exist()
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    cover: Joi.object({
                        ru: Joi.required()
                    }).unknown(),
                    description: Joi.object({
                        ru: Joi.string().required()
                    }),
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
                description: Joi.object({
                    en: Joi.exist().not(null)
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    cover: Joi.object({
                        en: Joi.required()
                    }).unknown(),
                    quiz: Joi.object({
                        questions: Joi.object({
                            en: Joi.required()
                        }).unknown()
                    }),
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
                    cover: Joi.object({
                        en: Joi.required()
                    }).unknown(),
                    description: Joi.object({
                        en: Joi.string().required()
                    }),
                })
            }
        )
        .when(
            Joi.object({
                cover: Joi.object({
                    en: Joi.exist()
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    description: Joi.object({
                        en: Joi.string().required()
                    }),
                    blocks: Joi.object({
                        en: Joi.required()
                    }).unknown(),
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
                blocks: Joi.object({
                    en: Joi.exist()
                }).unknown()
            }).unknown(),
            {
                then: Joi.object({
                    cover: Joi.object({
                        en: Joi.required()
                    }).unknown(),
                    description: Joi.object({
                        en: Joi.string().required()
                    }),
                    quiz: Joi.object({
                        questions: Joi.object({
                            en: Joi.required()
                        }).unknown()
                    })
                })
            }
        )
        .unknown(true);
