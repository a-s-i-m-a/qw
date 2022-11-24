import { FC } from "react";
import cn from "classnames";
import { DropdownArrow } from "../../../../ui/atoms/Icon";

interface SimpleButtonProps {
    onClick?: () => void;
    className?: string;
    label: string;
}

export const SimpleButton: FC<SimpleButtonProps> = ({
    label,
    className,
    onClick
}) => {
    const classes = cn(
        "flex text-14 font-semibold text-purple-main transition-opacity opacity-90 hover:opacity-100",
        className
    );

    return (
        <button type="button" onClick={onClick} className={classes}>
            {label}
            <DropdownArrow className="transform rotate-90 ml-2" />
        </button>
    );
};
