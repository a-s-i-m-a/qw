import { ListResponse } from "../../types";

export const transformObjectToOption = (words: string[]) =>
    words.map(item => ({
        label: item,
        value: item
    }));

export const transformResponseToOption = (
    data: ListResponse<{ _id: string; name: string; iso: string; }>
) => {
    return data.items.map(item => ({
        label: item.name,
        value: item._id,
        iso: item.iso
    }));
};
