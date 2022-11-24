import dayjs from "dayjs";
import { TFunction } from "i18next";
import Joi from "joi";
import { discountDateMask } from "../../catalogue/utils/transformProduct";
import { Currencies, Role } from "../../types";

const validateDate = (date: string, format: string) => {
    return dayjs(date, format).format(format) === date;
};
const validateDateMethod = (value: string) => {
    if (!validateDate(value, discountDateMask)) {
        throw new Error("nope");
    }

    return value;
};

export const getInstruments = (t: TFunction, role: Role) => ({
    bonusInstrument: Joi.object()
        .keys({
            isEnabled: Joi.boolean(),
            type: Joi.string()
        })
        .unknown(true),
    videoInstrument: Joi.object()
        .keys({
            isEnabled: Joi.boolean(),
            type: Joi.string(),
            videoId: Joi.object({
                label: Joi.string().messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                }),
                value: Joi.string().messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                })
            }).messages({
                "any.required": t("fieldIsRequired")
            })
        })
        .unknown(true)
        .when(
            Joi.object({
                isEnabled: Joi.valid(true)
            }).unknown(),
            {
                then: Joi.object({
                    videoId:
                        role !== "manufacturer" ? Joi.required() : Joi.object()
                })
            }
        ),
    reviewInstrument: Joi.object()
        .keys({
            isEnabled: Joi.boolean(),
            type: Joi.string(),
            reviewId: Joi.object({
                label: Joi.string().messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                }),
                value: Joi.string().messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                })
            }).messages({
                "any.required": t("fieldIsRequired")
            })
        })
        .unknown(true)
        .when(
            Joi.object({
                isEnabled: Joi.valid(true)
            }).unknown(),
            {
                then: Joi.object({
                    reviewId:
                        role !== "manufacturer" ? Joi.required() : Joi.object()
                })
            }
        ),
    discountInstrument: Joi.object({
        isEnabled: Joi.boolean(),
        type: Joi.string(),
        discountPrice: Joi.object({
            currency: Joi.string()
                .valid(...Currencies)
                .messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired"),
                    "any.valid": t("fieldIsRequired")
                }),
            value: Joi.number().messages({
                "number.empty": t("fieldIsRequired"),
                "number.base": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired"),
                "number.greater": t("fieldIsRequired")
            })
        }),
        percent: Joi.any(),
        endDate: Joi.string()
            .allow("", null)
            .custom(validateDateMethod, "date validation")
            .messages({
                "any.custom": t("invalidDate")
            })
    })
        .when(
            Joi.object({
                isEnabled: Joi.valid(true)
            }).unknown(),
            {
                then: Joi.object({
                    discountPrice: Joi.object({
                        value: Joi.number().greater(0)
                    })
                })
            }
        )
        .unknown(true)
});
export const getPromoSchema = (t: TFunction, role: Role = "admin") =>
    Joi.object({
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
        ...getInstruments(t, role)
    }).unknown(true);

export const getModalSchema = (t: TFunction) =>
    Joi.object({
        text: Joi.string()
            .required()
            .messages({
                "string.base": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired")
            })
    }).unknown()
