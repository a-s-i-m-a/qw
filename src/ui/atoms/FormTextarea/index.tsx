import { FC } from "react";
import { Textarea, TextareaProps } from "../../atoms/Textarea";
import cn from "classnames";
import { useFormContext, useController } from "react-hook-form";

export interface FormTextareaProps extends TextareaProps {
    label?: string;
    className?: string;
    textareaClasses?: string;
    isEditing?: boolean;
    name: string;
    hideLabel?: boolean;
    shouldUnregister?: boolean;
    description?: string;
}

export const FormTextarea: FC<FormTextareaProps> = ({
    label,
    name,
    className = "",
    hideLabel,
    textareaClasses = "",
    value,
    isEditing = true,
    shouldUnregister,
    defaultValue,
    description,
    ...rest
}) => {
    const wrapperCn = cn("relative flex flex-col w-full", className);
    const { control } = useFormContext();
    if (!control) {
        throw new Error("Provide FormContext before Textarea");
    }
    const {
        field,
        fieldState: { error }
    } = useController({
        name,
        control,
        shouldUnregister,
        defaultValue
    });

    return (
        <label className={wrapperCn}>
            {!hideLabel && label && (
                <div className="text-14 text-gray-text font-semibold mb-3 bot">
                    {label}
                </div>
            )}

            {isEditing ? (
                <>
                    <Textarea
                        inputClasses={textareaClasses}
                        isError={!!error}
                        {...rest}
                        {...field}
                    />

                    {!hideLabel && error && (
                        <span className="text-12 font-normal text-danger mt-3">
                            {error.message}
                        </span>
                    )}
                </>
            ) : (
                <span className="font-normal text-base text-dark-main">
                    {field?.value !== "" && field.value !== null
                        ? field?.value
                        : "—"}
                </span>
            )}
            {description && isEditing && !error && (
                <div className={`text-12 text-gray-text mt-3`}>
                    {description}
                </div>
            )}
        </label>
    );
};
