import { DeliveryAddress } from "./../../types";
import { TFunction } from "i18next";
import Joi from "joi";
import { Order, Role } from "../../types";

export const getOrderSchema = (t: TFunction, role?: Role) =>
    Joi.object<Order>({
        deliveryAddress: Joi.object<Partial<DeliveryAddress>>({
            country: Joi.object({
                label: Joi.string().required(),
                value: Joi.string().required()
            })
                .required()
                .messages({
                    "any.required": t("fieldIsRequired"),
                    "object.base": t("fieldIsRequired")
                })
                .unknown(true),
            phone: Joi.string().allow(null).optional(),
            state:  Joi.object({
                label: Joi.string().required(),
                value: Joi.string().required()
            })
                .allow(null)
                .optional()
                .messages({
                    "any.required": t("fieldIsRequired"),
                    "object.base": t("fieldIsRequired")
                })
                .unknown(true),
            city: Joi.string()
                .required()
                .messages({
                    "any.required": t("fieldIsRequired"),
                    "string.empty": t("fieldIsRequired")
                }),
            address: Joi.string()
                .required()
                .messages({
                    "any.required": t("fieldIsRequired"),
                    "string.empty": t("fieldIsRequired")
                }),
            apartment: Joi.string()
                .required()
                .messages({
                    "any.required": t("fieldIsRequired"),
                    "string.empty": t("fieldIsRequired")
                }),
            zip: Joi.string()
                .required()
                .messages({
                    "number.empty": t("fieldIsRequired"),
                    "number.base": t("fieldsNumbers"),
                    "any.required": t("fieldIsRequired")
                })
        })
            .required()
            .messages({
                "any.required": t("fieldIsRequired"),
                "string.empty": t("fieldIsRequired")
            })
            .unknown()
    }).unknown(true);
