import React, { FC } from "react";
import cn from "classnames";

import { Spinner } from "../../../../ui/atoms/Spinner";

interface ButtonProps {
    text?: string;
    isFull?: boolean;
    isDisabled?: boolean;
    isActive?: boolean;
    onClick?: () => void;
    isLoading?: boolean;
    autoFocus?: boolean;
    htmlType?: "button" | "reset" | "submit";
    className?: string;
    defaultColor?: string;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
}

export const IconButton: FC<ButtonProps> = ({
    text,
    isDisabled = false,
    isActive = true,
    onClick,
    isLoading,
    className,
    autoFocus = false,
    htmlType = "button",
    defaultColor = "bg-white",
    children,
    onMouseEnter,
    onMouseLeave
}) => {
    const classes = cn(
        className,
        `bg-opacity-70 focus:outline-none rounded-12p ${
            !isActive ? "bg-gray-bg" : defaultColor
        }`
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
