import { forwardRef } from "react";
import cn from "classnames";

interface ToggleProps {
    name?: string;
    isChecked: boolean;
    className?: string;
    children?: React.ReactNode;
    customColor?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isDisabled?: boolean;
}
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
    (
        {
            name,
            isChecked,
            className = "",
            children,
            onChange,
            customColor,
            isDisabled
        },
        ref
    ) => {
        const thumbPosition = isChecked ? "translate-x-full" : "";

        const trackClasses = cn(
            "block w-10 h-6 rounded-full transition-colors duration-300 ease-in-out",
            {
                "bg-gray-main opacity-30": !customColor && !isChecked,
                customColor: customColor && isChecked,
                "bg-purple-main": !customColor && isChecked,
                "opacity-50": isDisabled && isChecked
            }
        );
        const labelClasses = cn(
            "inline-flex items-center",
            isDisabled ? "pointer-events-none" : "cursor-pointer",
            className
        );
        return (
            <label className={labelClasses}>
                <span className={`relative ${children ? "mr-5" : ""}`}>
                    <span className={trackClasses} />
                    <span
                        className={`absolute block w-4 h-4 mt-1 ml-1 rounded-full inset-y-0 left-0 transition-transform duration-300 ease-in-out transform bg-white ${thumbPosition}`}
                    >
                        <input
                            className="absolute opacity-0 w-0 h-0"
                            onChange={onChange}
                            type="checkbox"
                            name={name}
                            ref={ref}
                            disabled={isDisabled}
                        />
                    </span>
                </span>
                {children}
            </label>
        );
    }
);
