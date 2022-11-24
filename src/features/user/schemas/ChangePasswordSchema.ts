import { TFunction } from "i18next";
import Joi from "joi";

export const getChangePasswordSchema = (t: TFunction) =>
    Joi.object<{
        oldPassword: string;
        password: string;
        repeatPassword: string;
    }>({
        oldPassword: Joi.string()
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired")
            }),
        password: Joi.string()
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired")
            }),
        repeatPassword: Joi.any()
            .valid(Joi.ref("password"))
            .required()
            .messages({
                "string.empty": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired"),
                "any.allowOnly": t("passwordsDoesntMatch"),
                "any.valid": t("passwordsDoesntMatch"),
                "any.only": t("passwordsDoesntMatch")
            })
    });
