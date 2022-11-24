import { TFunction } from "i18next";
import Joi from "joi";

export const getQRSchema = (t: TFunction) =>
    Joi.object({
        count: Joi.number()
            .required()
            .min(1)
            .messages({
                "any.required": t("fieldIsRequired"),
                "number.empty": t("fieldIsRequired"),
                "number.base": t("fieldIsRequired"),
                "number.min": t("minValue", {
                    value: 1
                })
            })
    });
