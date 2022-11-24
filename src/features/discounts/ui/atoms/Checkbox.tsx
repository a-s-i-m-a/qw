import { forwardRef, HTMLProps } from "react";
import { CheckboxChecked, CheckboxNotChecked } from "../../../../ui/atoms/Icon";

interface RadioProps extends HTMLProps<HTMLInputElement> {
    isChecked: boolean;
}
export const Checkbox = forwardRef<HTMLInputElement, RadioProps>(
    ({ className = "", children, isChecked, ...rest }, ref) => (
        <label
            className={`inline-flex items-center cursor-pointer ${className}`}
        >
            {isChecked ? <CheckboxChecked /> : <CheckboxNotChecked />}
            <input
                className="absolute opacity-0 w-0 h-0"
                type="checkbox"
                ref={ref}
                {...rest}
            />
            {children}
        </label>
    )
);
