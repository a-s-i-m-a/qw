import { Salepoint } from "./../../types";
import { TFunction } from "i18next";
import Joi from "joi";

export const salepointsSchema = (t: TFunction) =>
    Joi.object<Salepoint>({
        location: Joi.object({
            city: Joi.string().required(),
            address: Joi.string().required()
        })
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired")
            })
            .unknown()
    }).unknown();
