import reduceFields, { reduceList } from "../utils/reduceList";

const manufacturer = [
    "name",
    {logo: ["url"]},
    {country: ["name"]},
    "countryId",
    "article"
];

export const manufacturerFields = reduceList(manufacturer);

export const manufacturerListFields = reduceFields({
    items: manufacturer
});