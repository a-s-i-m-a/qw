import { TFunction } from "i18next";
import Joi from "joi";
import { Roles, User } from "../../types";
import { emailRegExp } from "../regexp";

export const getUserSchema = (t: TFunction) =>
    Joi.object<User>({
        name: Joi.string()
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired")
            }),
        role: Joi.string()
            .valid(...Roles)
            .required()
            .messages({
                "string.empty": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired")
            }),
        phone: Joi.string()
            .required()
            .messages({
                "string.empty": t("fieldIsRequired"),
                "string.base": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired")
            }),
        login: Joi.string()
            .pattern(new RegExp(emailRegExp))
            .required()
            .messages({
                "string.empty": t("fieldIsRequired"),
                "string.pattern.base": t("invalidEmail"),
                "any.required": t("fieldIsRequired")
            }),
        country: Joi.object({
            label: Joi.string()
                .required()
                .messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                }),
            value: Joi.string()
                .required()
                .messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                })
        })
            .unknown()
            .when("role", {
                is: "expert",
                then: Joi.required()
            })
            .messages({
                "any.required": t("fieldIsRequired")
            }),
        manufacturer: Joi.object({
            label: Joi.string()
                .required()
                .messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                }),
            value: Joi.string()
                .required()
                .messages({
                    "string.empty": t("fieldIsRequired"),
                    "any.required": t("fieldIsRequired")
                })
        })
            .unknown()
            .when("role", {
                is: "manufacturer",
                then: Joi.required()
            })
            .messages({
                "any.required": t("fieldIsRequired")
            })
    }).unknown(true);

export const getUserEditSchema = (t: TFunction) =>
    Joi.object({
        phone: Joi.string()
            .required()
            .messages({
                "string.empty": t("fieldIsRequired"),
                "string.base": t("fieldIsRequired"),
                "any.required": t("fieldIsRequired")
            }),
        email: Joi.string()
            .pattern(new RegExp(emailRegExp))
            .required()
            .messages({
                "string.empty": t("fieldIsRequired"),
                "string.pattern.base": t("invalidEmail"),
                "any.required": t("fieldIsRequired")
            })
    }).unknown();
