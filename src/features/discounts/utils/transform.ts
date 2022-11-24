import { Discounts } from "../../types";

export const transformPayload = (
    values: Partial<Discounts<false>>
): Partial<Discounts> => {
    return {
        _id: values._id,
        name: values.name,
        description: values.description,
        price: values.price,
        countryId: values.country?.value,
        imageId: values.imageId   
    }     
};

export const transformDiscount = (
    values: Partial<Discounts>
): Partial<Discounts<false>> => {
    return {
        _id: values._id,
        name: values.name,
        description: values.description,
        price: values.price,
        country: values?.country && {
            label: values?.country?.name, 
            value: values?.country?._id
        },
        image: values.image,
        retailerStoreIds: values?.retailerStoreIds && values?.retailerStoreIds?.reduce(
            (obj: any, item) => {
                obj[item] = item;
                return obj;
            },
            {}
        )   
    }     
};