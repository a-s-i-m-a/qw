import { FC, HTMLProps, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
    CheckboxDisabled,
    CheckboxNotChecked
} from "../../../../ui/atoms/Icon";
import { Checkbox } from "./Checkbox";

interface SquareRadioProps extends HTMLProps<HTMLInputElement> {
    className?: string;
    name: string;
    isEditing?: boolean;
    value: string;
}
export const FormCheckbox: FC<SquareRadioProps> = (
    { className = "", children, isEditing = true, value, name },
    ref
) => {
    const { control, register } = useFormContext();
    if (!control) {
        throw new Error("Provide FormContext before FormCheckbox");
    }
    const fieldValue = useWatch({
        control,
        name
    });
    const isChecked = useMemo(() => fieldValue === value, [fieldValue, value]);
    return isEditing ? (
        <Checkbox
            className={className}
            {...register(name)}
            value={value}
            isChecked={isChecked}
        />
    ) : isChecked ? (
        <CheckboxDisabled />
    ) : (
        <CheckboxNotChecked />
    );
};
