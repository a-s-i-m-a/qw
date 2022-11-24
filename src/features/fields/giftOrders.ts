import reduceFields, { reduceList } from "../utils/reduceList";

export const getGiftOrderFields = () => {
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
            bonusProductItems: [
                { bonusProduct: ["name", "price", "photo", "newPrice"] },
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

export const getGiftOrdersListFields = () => {
    const listFields = [
        "number",
        "createDate",
        "sentDate",
        "cancelDate",
        "completeDate",
        { deliveryAddress: [{ country: ["name"] }] },
        { bonusProductItems: [{ bonusProduct: ["name"] }, "amount"] },
        "status",
        "trackNumber",
        "isQvinoOrder"
    ];
    return reduceFields({
        items: listFields
    });
};