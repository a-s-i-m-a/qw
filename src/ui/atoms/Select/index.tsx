import { FC } from "react";
import { Crip } from "./Crip";
import { useSelectStyles } from "./useSelectStyles";
import AsyncCreatableSelect from "react-select/async-creatable";
import { CustomTypeOptions, useTranslation } from "react-i18next";
import debounce from "lodash.debounce";
import { useController, useFormContext } from "react-hook-form";
import { getText } from "./getText";

export type OptionType = {
    label: string;
    value: any;
};

interface SelectProps {
    placeholder?: string;
    hideLabel?: boolean;
    label?: string;
    isSearchable?: boolean;
    isMulti?: boolean;
    defaultOptions?: boolean | readonly OptionType[] | undefined;
    isEditing?: boolean;
    className?: string;
    onCreateOption?: (inputValue: string) => void;
    allowCreating?: boolean;
    loadOptions?: (inputValue: string) => Promise<OptionType[]>;
    cacheOptions?: boolean;
    needTranslation?: boolean;
    name: string;
    isDisabled?: boolean;
    onChangeSelect?: () => void;
}

export const Select: FC<SelectProps> = ({
    placeholder,
    hideLabel,
    label,
    isSearchable = false,
    isMulti = false,
    className = "",
    isEditing = true,
    onCreateOption,
    allowCreating = false,
    defaultOptions,
    loadOptions,
    cacheOptions = true,
    needTranslation,
    name,
    isDisabled,
    onChangeSelect
}) => {
    const { control } = useFormContext<
        Record<string, OptionType | OptionType[]>
    >();
    if (!control) {
        throw new Error("Provide FormContext before Select");
    }
    const {
        field,
        fieldState: { error }
    } = useController({
        control,
        name
    });

    const { styles } = useSelectStyles({
        isError: !!error,
        isMulti
    });
    const { t } = useTranslation();
    const loadSuggestedOptions = debounce((inputValue, callback) => {
        loadOptions!(inputValue).then(options => callback(options));
    }, 500);
    const handlerChange = (value: any) => {
        if (onChangeSelect) {
            onChangeSelect();
        }
        field.onChange(value);
    };
    return (
        <div className={`w-full flex flex-col ${className}`}>
            {!hideLabel && (
                <div className="text-14 text-gray-text font-semibold mb-3 bot">
                    {label}
                </div>
            )}

            {isEditing ? (
                <>
                    <AsyncCreatableSelect
                        isSearchable={isSearchable}
                        placeholder={placeholder}
                        styles={styles}
                        loadOptions={
                            loadOptions ? loadSuggestedOptions : undefined
                        }
                        isMulti={isMulti}
                        onCreateOption={onCreateOption}
                        components={{
                            IndicatorSeparator: () => null,
                            LoadingIndicator: () => null
                        }}
                        isDisabled={isDisabled}
                        defaultOptions={defaultOptions}
                        formatCreateLabel={label => `${t("add")} "${label}"`}
                        isValidNewOption={value =>
                            !!allowCreating && value.length > 0
                        }
                        formatOptionLabel={({ label }) =>
                            needTranslation
                                ? t(
                                      `${label}` as keyof CustomTypeOptions["resources"]["en"]
                                  )
                                : label
                        }
                        cacheOptions={cacheOptions}
                        loadingMessage={() => t("isLoading")}
                        noOptionsMessage={() => t("noOptions")}
                        closeMenuOnScroll={true}
                        onChange={e => handlerChange(e)}
                        value={field.value}
                    />
                    {!hideLabel && error?.message && (
                        <span className="inline-block text-12 font-normal text-danger mt-3">
                            {error.message}
                        </span>
                    )}
                </>
            ) : (
                <>
                    {isMulti && Array.isArray(field.value) ? (
                        <section className="flex flex-wrap gap-y-10p justify-start whitespace-nowrap">
                            {field.value.length > 0
                                ? field.value.map(item => (
                                      <Crip
                                          key={item.value}
                                          title={
                                              needTranslation
                                                  ? (t(
                                                        `${item.label}` as keyof CustomTypeOptions["resources"]["en"]
                                                    ) as string)
                                                  : item.label
                                          }
                                      />
                                  ))
                                : "—"}
                        </section>
                    ) : (
                        <span className="h-9 font-normal text-base text-dark-main">
                            {field.value
                                ? getText(
                                      field.value,
                                      needTranslation ? t : undefined
                                  )
                                : "—"}
                        </span>
                    )}
                </>
            )}
        </div>
    );
};
