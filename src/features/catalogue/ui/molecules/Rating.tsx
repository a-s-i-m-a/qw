import { FC, FunctionComponent, SVGProps, useState } from "react";
import { FormInput } from "../../../../ui/atoms/FormInput";
import { NumberFormatValues } from "react-number-format";
import { Toggle } from "../../../../ui/atoms/Toggle";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface RatingProps {
    Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
    label: string;
    formLabel: string;
    min?: number;
    max?: number;
    code?: string;
    name: string;
    isEditing?: boolean;
    allowDecimal?: boolean;
    multiplyingKoef?: number;
    bottomDescription?: string;
    awardToggleName?: string;
    onToggle?: (value: boolean) => void;
}

export const Rating: FC<RatingProps> = ({
    label,
    Icon,
    max,
    min,
    name,
    isEditing,
    allowDecimal = false,
    multiplyingKoef = 1,
    formLabel,
    code,
    bottomDescription,
    awardToggleName,
    onToggle
}) => {
    const { setValue } = useFormContext();
    const [isEnabled, setEnabled] = useState<boolean>(false);

    const handleToggle = () => {
        setEnabled(prev => {
            const value = !prev;
            onToggle && onToggle(value);
            return value;
        });
    };

    useEffect(() => {
        if (code) {
            setValue(name.replace("rating", "code"), code);
        }
    }, [code, name, setValue]);

    return (
        <div className="border border-gray-bg p-30p flex flex-col rounded-10p">
            <div className="flex items-center mb-30p">
                <Icon className="rounded-lg" />
                <span className="font-bold text-14 text-dark-main ml-4.5">
                    {label}
                </span>
                {awardToggleName && isEditing && (
                    <Toggle
                        onChange={handleToggle}
                        isChecked={isEnabled}
                        name={awardToggleName}
                        className="ml-auto"
                    />
                )}
            </div>

            <div className="flex flex-col">
                <>
                    <FormInput
                        name={name}
                        label={formLabel}
                        isMaskedNumber={true}
                        multiplyingKoef={multiplyingKoef}
                        decimalScale={allowDecimal ? 2 : 0}
                        allowNegative={false}
                        isEditing={isEditing}
                        format="####"
                        isDisabled={awardToggleName ? !isEnabled : false}
                        isAllowed={({ floatValue }: NumberFormatValues) => {
                            if (floatValue && min && floatValue < min) {
                                return false;
                            }
                            if (floatValue && max && floatValue > max) {
                                return false;
                            }
                            if (floatValue === undefined) {
                                setEnabled(false);
                            }
                            return true;
                        }}
                        description={bottomDescription}
                    />
                </>
            </div>
        </div>
    );
};
