import { TFunction } from "i18next";
import Joi from "joi";
import { ProductPayload } from "../../catalogue/types";
import { Currencies, Role } from "../../types";
import { getInstruments } from "./PromoSchema";

export const getProductSchema = (
    t: TFunction,
    role: Role,
    checkInstruments: boolean
) =>
    Joi.object<ProductPayload>({
        name: Joi.string()
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired")
            }),
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
        wineType: Joi.object({
            label: Joi.string().required(),
            value: Joi.string().required()
        })
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "any.empty": t("fieldIsRequired")
            }),
        volume: Joi.number()
            .required()
            .messages({
                "number.empty": t("fieldIsRequired"),
                "number.base": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired")
            }),
        price: Joi.object({
            currency: Joi.string()
                .valid(...Currencies)
                .required()
                .messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired"),
                    "any.valid": t("fieldIsRequired")
                }),
            value: Joi.number()
                .min(1)
                .required()
                .messages({
                    "number.min": t("fieldIsRequired"),
                    "number.empty": t("fieldIsRequired"),
                    "number.base": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                })
        }).required(),
        vintage: Joi.number()
            .integer()
            .allow("", 0)
            .min(1900)
            .max(new Date().getFullYear())
            .messages({
                "number.min": t("minYear", {
                    year: 1900
                }),
                "number.max": t("maxYear", {
                    year: new Date().getFullYear()
                })
            }),
        awardYear: Joi.number()
            .integer()
            .min(1900)
            .max(new Date().getFullYear())
            .allow("", 0)
            .messages({
                "number.min": t("minYear", {
                    year: 1900
                }),
                "number.max": t("maxYear", {
                    year: new Date().getFullYear()
                })
            }),
        country: Joi.object({
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
        region: Joi.object({
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
        agingPotential: Joi.number()
            .integer()
            .allow("", null)
            .min(1)
            .max(60)
            .messages({
                "number.min": t("minYear", {
                    year: 1
                }),
                "number.max": t("maxYear", {
                    year: 60
                })
            }),
        recommendedYear: Joi.number()
            .integer()
            .min(1900)
            .allow("", 0, null)
            .messages({
                "number.min": t("minYear", {
                    year: 1900
                })
            }),
        altitude: Joi.number().integer().allow("", 0, null),
        ...(checkInstruments ? getInstruments(t, role) : {})
    }).unknown(true);
