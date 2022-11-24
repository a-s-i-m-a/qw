import { ComponentType, ReactText, ReactElement } from "react";

type CellProps<D extends object, V = any, I = number> = {
    row: D;
    cell: V;
    index?: I;
};

interface Values<D extends object = {}, V = any, I = number> {
    Cell?: (props: CellProps<D, V, I>) => React.ReactNode;
    Header?: ComponentType | ReactText | ReactElement;
    width: number | string;
    canSort?: boolean;
    id?: string;
    isVisible?: boolean;
}

type ValueOf<T> = T[keyof T];

export type Column<D extends object = {}> = ValueOf<
    {
        [K in keyof D]: {
            accessor: K;
        } & Values<D, D[K]>;
    }
>;

export interface PageOptions {
    skip: number;
    limit: number;
    sort?: string;
    [option: string]: unknown;
}
