import { FC } from "react";
import cn from "classnames";

interface StatusProps {
    status: "danger" | "success" | "neutral" | "black";
    text: string;
    className?: string;
}
export const Status: FC<StatusProps> = ({ status, text, className }) => {
    const wrapperClasses = cn(
        "py-5p px-10p rounded-10p text-12 font-normal whitespace-nowrap",
        {
            "text-white bg-green-main": status === "success",
            "text-dark-main bg-gray-light": status === "neutral",
            "text-white bg-danger": status === "danger",
            "text-white bg-dark-main": status === "black"
        },
        className
    );
    return <div className={wrapperClasses}>{text}</div>;
};
