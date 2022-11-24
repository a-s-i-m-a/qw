import { TFunction } from "i18next";
import Joi from "joi";
import { Currencies, Product } from "../../types";

export const getAddToStoreSchema = (t: TFunction) =>
    Joi.object<Pick<Product, "stockCount" | "price">>({
        stockCount: Joi.number()
            .positive()
            .required()
            .allow(0)
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
        }).required()
    });
