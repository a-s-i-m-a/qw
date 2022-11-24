import { User } from "../../types";
import { UserPayload } from "../types";

export const transformUser = (user: User): UserPayload => {
    return {
        ...user,
        country: user.country
            ? {
                  label: user.country.name,
                  value: user.country._id
              }
            : undefined,
        manufacturer: user.manufacturer
            ? {
                  label: user.manufacturer.name,
                  value: user.manufacturer._id
              }
            : undefined,
        retailer: user.retailer
            ? {
                  label: user.retailer.name,
                  value: user.retailer._id
              }
            : undefined
    };
};

export const transformPayload = (values: UserPayload): Partial<User> => {
    return {
        name: values.name,
        login: values.login,
        phone: values.phone,
        countryId: values.country?.value,
        manufacturerId: values.manufacturer?.value,
        retailerId: values.retailer?.value,
        photoId: values.photoId,
        role: values.role,
        _id: values._id
    };
};
