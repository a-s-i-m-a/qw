import { TFunction } from "i18next";
import Joi from "joi";
import { VineStyle } from "../../types";

export const getVineStyleSchema = (t: TFunction) =>
    Joi.object<VineStyle>({
        name: Joi.string()
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired")
            })
    });
