import { TFunction } from "i18next";
import Joi from "joi";
import { Region } from "../../types";

export const getRegionSchema = (t: TFunction) =>
    Joi.object<Region>({
        name: Joi.string()
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired")
            }),
        country: Joi.object({
            label: Joi.string().required(),
            value: Joi.string().required()
        })
        .required()
        .unknown()
    }).unknown();
