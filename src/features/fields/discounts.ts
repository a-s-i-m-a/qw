import reduceFields, { reduceList } from "../utils/reduceList";

const fields = [
    "name",
    "description",
    "imageId",
    { image: ["url"] },
    { price: ["currency", "value"] },
    { country: ["name"] },
    "retailerStoreIds",
    "createDate",
    "status",
    { retailer: ["name", { logo: ["url"] }] }
];

export const discountsFields = reduceList(fields);

export const discountsListFields = reduceFields({
    items: fields
});
