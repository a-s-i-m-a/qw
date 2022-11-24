import reduceFields, { reduceList } from "../utils/reduceList";

const fields = ["name"];

export const grapeSortFields = reduceList(fields);

export const grapeSortListFields = reduceFields({
    items: fields
});
