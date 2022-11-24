import Joi from "joi";
import { TFunction } from "react-i18next";

const getLangMap = (t: TFunction) =>
    Joi.object()
        .keys({
            en: Joi.string().messages({
                "string.empty": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired")
            }).required(),
            ru: Joi.string().messages({
                "string.empty": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired")
            }).required(),
            it: Joi.string().messages({
                "string.empty": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired")
            }).required()
        })
        .required()
        .messages({
            "any.required": t("fieldIsRequired")
        });

export const getGiftSchema = (t: TFunction) =>
        Joi.object({
            name: getLangMap(t),
            description: getLangMap(t),
            pricePoints: Joi.number()
                .required()
                .min(1)
                .messages({
                    "number.min": t("fieldIsRequired"),
                    "number.empty": t("fieldIsRequired"),
                    "number.base": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                }),
            saleStatus: Joi.boolean().messages({
                "string.empty": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired")
            }),
            stockCount: Joi.number()
                .required()
                .min(1)
                .messages({
                    "number.min": t("fieldIsRequired"),
                    "number.empty": t("fieldIsRequired"),
                    "number.base": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                })
        })
        .unknown(true)
