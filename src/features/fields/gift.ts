import reduceFields, { reduceList } from "../utils/reduceList";

const fields = [
    { name: ["en", "ru", "it"] },
    { description: ["en", "ru", "it"] },
    { price: ["currency", "value"] },
    "saleStatus",
    { photo: ["url"] },
    "photoId",
    "stockCount",
    "createDate"
];

export const giftFields = reduceList(fields);

export const giftListFields = reduceFields({
    items: fields
});