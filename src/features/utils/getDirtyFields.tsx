import { DeepMap } from "react-hook-form";

export const getDirtyFields = <DataType extends Record<string, any>>(
    data: DataType,
    dirtyFileds: DeepMap<DataType, true>
): DataType => {
    let newData = {} as DataType;
    for (const [key] of Object.entries(dirtyFileds)) {
        newData[key as keyof DataType] = data[key];
    }
    return newData;
};

type UnknownArrayOrObject = unknown[] | Record<string, unknown>;

export const dirtyValuesRecursive = (
    dirtyFields: UnknownArrayOrObject | boolean,
    allValues: UnknownArrayOrObject
): UnknownArrayOrObject => {
    // NOTE: Recursive function.

    // If *any* item in an array was modified, the entire array must be submitted, because there's no
    // way to indicate "placeholders" for unchanged elements. `dirtyFields` is `true` for leaves.
    if (dirtyFields === true || Array.isArray(dirtyFields)) {
        return allValues;
    }

    // Here, we have an object.
    return Object.fromEntries(
        Object.keys(dirtyFields).map(key => [
            key,
            //@ts-ignore
            dirtyValuesRecursive(dirtyFields[key], allValues[key])
        ])
    );
};
