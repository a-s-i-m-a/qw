import React, { FC } from "react";
import cn from "classnames";

import { Spinner } from "../Spinner";

interface ButtonProps {
    text?: string;
    isFull?: boolean;
    isDisabled?: boolean;
    onClick?: () => void;
    isLoading?: boolean;
    autoFocus?: boolean;
    type?:
        | "primary"
        | "secondary"
        | "tertiary"
        | "icon"
        | "secondary-danger"
        | "range-picker";
    htmlType?: "button" | "reset" | "submit";
    customColor?: string;
    className?: string;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    isActive?: boolean;
}

export const Button: FC<ButtonProps> = ({
    text,
    isDisabled = false,
    isFull = false,
    onClick,
    isLoading,
    type = "primary",
    className,
    autoFocus = false,
    htmlType = "submit",
    children,
    onMouseEnter,
    onMouseLeave,
    customColor,
    isActive = false
}) => {
    const classes = cn(
        className,
        "flex flex-shrink-0 items-center justify-center relative",
        "rounded-2.5 outline-none focus:outline-none",
        "min-h-10 rounded-10p",
        "font-semibold text-14",
        "transition-all duration-100",
        {
            "px-25p py-2": type !== "icon",
            "p-10p bg-gray-bg text-dark-main hover:bg-purple-main hover:text-white":
                type === "icon",
            "text-white":
                type === "primary" || (type === "range-picker" && isActive),
            "bg-purple-main":
                (type === "primary" && isActive) ||
                (type === "range-picker" && isActive),
            "bg-dark-main": type === "primary" && !isDisabled && !isActive,
            "bg-gray-main": isDisabled && type !== "tertiary",
            "w-full": isFull,
            "text-opacity-0": isLoading,
            "bg-gray-bg": type === "range-picker" && !isActive,
            "text-gray-text hover:text-dark-main":
                type === "tertiary" && !customColor,

            [`${customColor} opacity-80 hover:opacity-100`]:
                type === "tertiary" && customColor,
            "border border-gray-main text-dark-main": type === "secondary",
            "border border-gray-main text-danger": type === "secondary-danger"
        }
    );

    return (
        <button
            type={htmlType}
            disabled={isDisabled}
            className={classes}
            onClick={onClick}
            autoFocus={autoFocus}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center">
                    <Spinner />
                </div>
            )}
            {children || <span>{text}</span>}
        </button>
    );
};
