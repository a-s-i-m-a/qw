import React, { FC } from "react";
import { IconButton } from "../../../features/articles/ui/atoms/IconButton";
import { CheckBtnIcon } from "../../atoms/Icon";
import { Input } from "../../atoms/Input";
import { dateMask } from "../Calendar/dateUtils";

interface RangeInputsProps {
    startInputValue: string;
    endInputValue: string;
    startInputError: boolean;
    endInputError: boolean;
    onEndInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onStartInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onInputsSubmit: () => void;
}

export const RangeInputs: FC<RangeInputsProps> = ({
    startInputValue,
    endInputValue,
    startInputError,
    endInputError,
    onEndInputChange,
    onStartInputChange,
    onInputsSubmit
}) => {
    const inputClasses =
        "w-92p h-44p py-5p px-5p rounded-10p text-12 text-dark-main bg-white";
    return (
        <section className="bg-gray-bg py-10p px-20p rounded-b-xl relative top-2 flex flex-row items-center justify-between">
            <span>
                <Input
                    name="endRange"
                    onChange={onEndInputChange}
                    value={endInputValue}
                    inputClasses={inputClasses}
                    placeholder={dateMask}
                    isError={endInputError}
                />
                {" - "}
                <Input
                    name="startRange"
                    onChange={onStartInputChange}
                    value={startInputValue}
                    inputClasses={inputClasses}
                    placeholder={dateMask}
                    isError={startInputError}
                />
            </span>
            <IconButton
                className="h-44p w-44p flex justify-center items-center ml-8p bg-opacity-100"
                defaultColor="bg-green-main"
                onClick={onInputsSubmit}
            >
                <CheckBtnIcon />
            </IconButton>
        </section>
    );
};
