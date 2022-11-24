import reduceFields, { reduceList } from "../utils/reduceList";

export const getFields = () => {
    const fields = [
        "number",
        "createDate",
        {
            deliveryAddress: [
                { country: ["name", "iso", "requiresState"] },
                "address",
                "phone",
                "city",
                "state",
                "apartment",
                "zip"
            ]
        },
        {
            items: [
                { product: ["name", "price", "photo", "newPrice"] },
                "amount"
            ]
        },
        "deliveryCost",
        "status",
        "total",
        "user",
        "trackNumber",
        "isQvinoOrder"
    ];
    return reduceList(fields);
};

export const getListFields = () => {
    const listFields = [
        "number",
        "createDate",
        "sentDate",
        "cancelDate",
        "completeDate",
        { manufacturer: ["name"] },
        { deliveryAddress: [{ country: ["name"] }] },
        { items: [{ product: ["name"] }, "amount"] },
        "total",
        "status",
        "trackNumber",
        "isQvinoOrder"
    ];
    return reduceFields({
        items: listFields
    });
};
