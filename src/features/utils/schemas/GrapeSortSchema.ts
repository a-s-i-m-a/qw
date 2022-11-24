import { TFunction } from "i18next";
import Joi from "joi";
import { GrapeSort } from "../../types";

export const getGrapeSortSchema = (t: TFunction) =>
    Joi.object<GrapeSort>({
        name: Joi.string()
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired")
            })
    });
