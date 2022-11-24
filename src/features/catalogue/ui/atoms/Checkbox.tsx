import { forwardRef, HTMLProps } from "react";
import { useController, useFormContext } from "react-hook-form";
import { CheckboxChecked, CheckboxNotChecked } from "../../../../ui/atoms/Icon";

interface RadioProps extends HTMLProps<HTMLInputElement> {
    name: string;
}
export const Checkbox = forwardRef<HTMLInputElement, RadioProps>(
    ({ className = "", children, name, ...rest }, ref) => {
        const { control, register } = useFormContext();
        if (!control) {
            throw new Error("Provide FormContext before FormCheckbox");
        }
        const {
            field: { value, onChange },
        } = useController({
            control,
            name
        });

        const onCheck = () => {
            onChange(!value)
        }
        return (
        <label
            className={`inline-flex items-center cursor-pointer ${className}`}
        >
            {value ? <CheckboxChecked /> : <CheckboxNotChecked />}
            <input
                {...register(name)}
                className="absolute opacity-0 w-0 h-0"
                type="checkbox"
                ref={ref}
                name={name}
                onClick={onCheck}
                {...rest}
            />
            {children}
        </label>
    )}
);