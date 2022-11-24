import { Languages } from './../../types';
import { langTabs } from "../../../ui/organisms/LanguageTabChanger";
import { Gift } from "../../types";
import { GiftPayload } from "../types";
import {
    transformFromPriceObject,
    transformToPriceObject
} from "./transformObjects";

export const transformToFormData = (values: Gift): Partial<GiftPayload> => {
    return {
        name: values?.name,
        description: values?.description,
        price: transformToPriceObject(values),
        saleStatus: values?.saleStatus ? "inSale" : "none",
        photo: values?.photo,
        photoId: values?.photoId,
        stockCount: values?.stockCount,
        _id: values?._id
    };
};

export const transformPayload = (values: GiftPayload): Gift => {
    return {
        name: values?.name,
        description: values?.description,
        pricePoints: transformFromPriceObject(values.price),
        saleStatus: values?.saleStatus === "inSale",
        photo: values?.photo,
        photoId: values?.photoId ? values?.photoId : "",
        stockCount: values?.stockCount,
        price: values.price,
        _id: values?._id,
        createDate: values?.createDate,
        lang: langTabs.find(lang => lang.value === "en")
    };
};

export const transformData = (values: Gift, language?: Languages): Partial<Gift> => {
    return {
        name: values?.name,
        description: values?.description,
        price: transformToPriceObject(values),
        pricePoints: values?.price?.value,
        saleStatus: values?.saleStatus,
        photo: values?.photo,
        photoId: values?.photoId,
        stockCount: values?.stockCount,
        _id: values?._id,
        lang: language 
            ? langTabs.find(lang => lang.value === language) 
            : langTabs.find(lang => lang.value === "en")!
    };
};
