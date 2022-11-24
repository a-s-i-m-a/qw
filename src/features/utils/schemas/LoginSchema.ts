import { TFunction } from "i18next";
import Joi from "joi";
import { emailRegExp } from "../regexp";

export const getForgotSchema = (t: TFunction) =>
    Joi.object<{
        login: string;
    }>({
        login: Joi.string()
            .pattern(new RegExp(emailRegExp))
            .required()
            .messages({
                "string.empty": t("fieldIsRequired"),
                "string.pattern.base": t("invalidEmail"),
                "any.required": t("fieldIsRequired")
            })
    });
export const getLoginSchema = (t: TFunction) =>
    Joi.object<{
        login: string;
        password: string;
    }>({
        login: Joi.string()
            .pattern(new RegExp(emailRegExp))
            .required()
            .messages({
                "string.empty": t("fieldIsRequired"),
                "string.pattern.base": t("invalidEmail"),
                "any.required": t("fieldIsRequired")
            }),
        password: Joi.string()
            .required()
            .messages({
                "string.empty": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired")
            })
    });
