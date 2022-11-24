import { useMemo } from "react";
import { FC } from "react";
import { useWatch } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { RadioCheckIcon } from "../Icon";
import { Radio } from "../Radio";

interface FormRadioProps {
    className?: string;
    name: string;
    isEditing?: boolean;
    value: string;
}

export const FormRadio: FC<FormRadioProps> = ({
    name,
    className = "",
    isEditing = true,
    value
}) => {
    const { control, register } = useFormContext();
    if (!control) {
        throw new Error("Provide FormContext before FormRadio");
    }
    const fieldValue = useWatch({
        control,
        name
    });

    const isChecked = useMemo(() => fieldValue === value, [fieldValue, value]);
    return isEditing ? (
        <Radio
            className={className}
            {...register(name)}
            value={value}
            isChecked={isChecked}
        />
    ) : isChecked ? (
        <RadioCheckIcon />
    ) : null;
};
