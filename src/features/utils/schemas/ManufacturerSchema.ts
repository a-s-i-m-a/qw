import { TFunction } from "i18next";
import Joi from "joi";
import { Manufacturer } from "../../types";

export const getManufacturerSchema = (t: TFunction) =>
    Joi.object<Manufacturer>({
        name: Joi.string()
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired")
            }),
        country: Joi.object({
            label: Joi.string().required(),
            value: Joi.string().required()
        }).required()
        .unknown()
    }).unknown();
