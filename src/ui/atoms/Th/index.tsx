import { FC } from "react";
import cn from "classnames";
import { SortIcon } from "../SortIcon";

interface ThProps {
    sorted?: boolean;
    handleSort?: () => void;
    sortIndex?: number;
}
export const Th: FC<ThProps> = ({
    children,
    sorted,
    handleSort,
    sortIndex
}) => {
    const classes = cn(
        "sticky block z-20 top-0 text-gray-text font-semibold text-14 leading-4 py-14p px-10p bg-gray-bg first:pl-5 first:rounded-l-2xl last:rounded-r-2xl",
        {
            "cursor-pointer hover:text-violet-saturated": !!handleSort,
            "text-violet-saturated": sorted,
            "text-gray-medium": !sorted
        }
    );

    return (
        <th onClick={handleSort} className={classes}>
            <span className="flex items-center flex-1 whitespace-nowrap">
                {children}
                {!!handleSort && (
                    <SortIcon className="ml-1" sortIndex={sortIndex || 0} />
                )}
            </span>
        </th>
    );
};
