import reduceFields, { reduceList } from "../utils/reduceList";

const fields = ["name"];

export const vineStyleFields = reduceList(fields);

export const vineStyleListFields = reduceFields({
    items: fields
});
