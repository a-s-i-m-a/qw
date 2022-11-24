import { TFunction } from "i18next";
import Joi from "joi";
import { Currencies, Discounts, Role } from "../../types";

export const getDiscountSchema = (t: TFunction, role?: Role) =>
    Joi.object<Discounts>({
        name: Joi.string()
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired")
            }),
        description: Joi.string()
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired")
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
        country: Joi.object({
            label: Joi.string().required(),
            value: Joi.string().required()
        })
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "object.base": t("fieldIsRequired")
            })
            .unknown(true)
    }).unknown(true);
