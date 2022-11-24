import { Retailer } from "./../../types";
import { TFunction } from "i18next";
import Joi from "joi";

export const getRetailerSchema = (t: TFunction) =>
    Joi.object<Retailer>({
        name: Joi.string()
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired")
            })
    }).unknown();
