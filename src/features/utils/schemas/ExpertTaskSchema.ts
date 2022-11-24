import { TFunction } from "i18next";
import Joi from "joi";
import { ExpertTask, Role } from "../../types";

export const getExpertTaskSchema = (t: TFunction, role: Role) => {
    if (role === "expert") {
        return Joi.object<ExpertTask>({
            videoUrl: Joi.string()
                .required()
                .messages({
                    "string.empty": t("fieldIsRequired"),
                    "string.base": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                })
        }).unknown(true);
    }
    return Joi.object<ExpertTask>({
        videoUrl: Joi.string()
            .required()
            .messages({
                "string.empty": t("fieldIsRequired"),
                "string.base": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired")
            })
    }).unknown(true);
};
