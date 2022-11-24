import reduceFields, { reduceList } from "../utils/reduceList";

const fields = [{ location: ["city", "address", "coordinates"] }];

export const salepointsFields = reduceList(fields);

export const salepointsListFields = reduceFields({
    items: fields
});
