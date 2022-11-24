import cn from "classnames";
import { forwardRef } from "react";

export interface TextareaProps extends React.HTMLProps<HTMLTextAreaElement> {
    isError?: boolean;
    inputClasses?: string;
    name?: string;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ name, placeholder, inputClasses, isError, ...rest }, ref) => {
        const inputCn = cn(
            "w-full bg-gray-bg rounded-10p font-normal text-base text-dark-main placeholder-gray-text",
            "px-4.5 py-11p",
            "",
            {
                "border border-danger": isError
            },
            inputClasses
        );

        return (
            <textarea
                ref={ref}
                name={name}
                placeholder={placeholder || " "}
                className={inputCn}
                {...rest}
            />
        );
    }
);
