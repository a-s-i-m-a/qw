import { TFunction } from "i18next";
import Joi from "joi";

const getOptionType = (t: TFunction) =>
    Joi.object({
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
        .unknown();

export const getTaskSchema = (t: TFunction) =>
    Joi.object({
        productId: getOptionType(t),
        expertId: getOptionType(t),
        type: getOptionType(t)
    });
