import { Column } from "./types";

export const getGridTemplate = <DType extends object>(
    columns: Column<DType>[]
) =>
    columns.reduce(
        (prev, current) =>
            `${prev} ${
                typeof current.width === "string"
                    ? current.width
                    : `minmax(${current.width}px, max-content)`
            }`,
        ""
    );
