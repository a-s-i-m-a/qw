import { Items, Languages, Product } from "./../../types";
import { getSafariFriendlyDate } from "./../../catalogue/utils/getSafariFriendlyDate";
import { Order } from "../../types";
import { getOptions } from "./getOptions";

export const transformOrder = (
    values: Partial<Order<false>>,
    lang: Languages
): Partial<Order> => {
    return {
        deliveryAddress: values.deliveryAddress && {
            ...values.deliveryAddress,
            country: values?.deliveryAddress.country && {
                label: values?.deliveryAddress?.country?.name || "",
                value: values?.deliveryAddress?.country?._id
            },
            state: values.deliveryAddress.state ? 
            getOptions(values?.deliveryAddress?.country?.iso)?.find(item =>
                item.value === values?.deliveryAddress?.state
                ) :
            undefined
        },
        createDate: getSafariFriendlyDate(values?.createDate).format(
            "DD.MM.YYYY HH:mm"
        )
    };
};

export const transformPayload = (values: Partial<Order>): Partial<Order<false>> => {
    return {
        ...values,
        deliveryAddress: values.deliveryAddress
            ? {
                  ...values.deliveryAddress,
                  country: undefined, 
                  countryId: values.deliveryAddress?.country?.value,
                  state: values?.deliveryAddress?.state?.value ? values?.deliveryAddress?.state?.value : undefined
              }
            : {}
    };
};

export const transformItems = (values: Items<Product<false>>[]) => {
    return values.reduce((items, item) => {
        items.push({
            productId: item?.product?._id,
            amount: item?.amount
        })
        return items 
    }, [] as Items<Product<false>>[])
}
