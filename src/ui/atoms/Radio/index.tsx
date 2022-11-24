import { forwardRef, HTMLProps } from "react";
import { RadioChecked, RadioNotChecked } from "../Icon";

interface RadioProps extends HTMLProps<HTMLInputElement> {
    isChecked: boolean;
}
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
    ({ className = "", children, isChecked, ...rest }, ref) => (
        <label
            className={`inline-flex items-center cursor-pointer ${className}`}
        >
            {isChecked ? <RadioChecked /> : <RadioNotChecked />}
            <input
                className="absolute opacity-0 w-0 h-0"
                type="radio"
                ref={ref}
                {...rest}
            />
            {children}
        </label>
    )
);
