import { FC } from "react";
import { PriceType } from "../../../features/types";
import {
    formatNumber,
    formatThousands
} from "../../../features/utils/formatNumber";
import { getSuffix } from "../../../features/utils/getSuffix";

interface PriceProps {
    price?: PriceType;
    newPrice?: PriceType | null;
    isAvailableForSale?: boolean;
    className?: string;
}
export const Price: FC<PriceProps> = ({
    price,
    isAvailableForSale,
    newPrice,
    className
}) => (
    <ul
        className={
            className ? className : "flex flex-col items-end absolute right-0"
        }
    >
        {price ? (
            <>
                <li
                    className={
                        newPrice ? "line-through text-gray-text" : undefined
                    }
                >
                    {formatNumber({
                        value: price?.currency !== "points" 
                            ? formatThousands(price.value / 100) 
                            : formatThousands(price.value),
                        thousandSeparator: " ",
                        type: "tel",
                        prefix: isAvailableForSale === true ? undefined : "~",
                        suffix: getSuffix(price.currency)
                    })}
                </li>
                {newPrice && isAvailableForSale && (
                    <li>
                        {formatNumber({
                            value: price?.currency !== "points" 
                                ? formatThousands(newPrice.value / 100) 
                                : formatThousands(newPrice.value),
                            thousandSeparator: " ",
                            type: "tel",
                            suffix: getSuffix(price.currency)
                        })}
                    </li>
                )}
            </>
        ) : (
            <li>—</li>
        )}
    </ul>
);
