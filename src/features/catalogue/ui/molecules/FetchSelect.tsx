import { FC, useCallback } from "react";
import { Select } from "../../../../ui/atoms/Select";
import { transformResponseToOption } from "../../utils/objectUtils";
import { ListResponse } from "../../../types";

type DataType = {
    name: string;
    _id: string;
} & Record<string, any>;
interface FetchSelectProps<OType extends object = object> {
    fetchFn: (props: OType) => Promise<ListResponse<DataType>>;
    placeholder?: string;
    name: string | any;
    label?: string;
    isMulti?: boolean;
    isEditing?: boolean;
    className?: string;
    isSearchable?: boolean;
    onCreateOption?: (inputValue: string) => void;
    allowCreating?: boolean;
    isDisabled?: boolean;
    extraArgs?: OType;
    cacheOptions?: boolean;
    onChangeSelect?: () => void;
}

export const FetchSelect: FC<FetchSelectProps> = ({
    name,
    placeholder,
    label,
    fetchFn,
    isMulti = false,
    className,
    isEditing = true,
    isSearchable,
    allowCreating = false,
    isDisabled,
    onCreateOption,
    extraArgs,
    cacheOptions,
    onChangeSelect
}) => {
    const fetch = useCallback(
        async (value: string) => {
            const data = (await fetchFn({
                disableCancel: true,
                search: value,
                ...extraArgs
            })) as ListResponse<{ _id: string; name: string; iso: string }>;
            return transformResponseToOption(data);
        },
        [extraArgs, fetchFn]
    );

    return (
        <Select
            name={name}
            isMulti={isMulti}
            placeholder={placeholder}
            defaultOptions={!isDisabled}
            label={label}
            isEditing={isEditing}
            className={className}
            loadOptions={fetch}
            isSearchable={isSearchable}
            allowCreating={allowCreating}
            onCreateOption={onCreateOption}
            isDisabled={isDisabled}
            cacheOptions={cacheOptions}
            onChangeSelect={onChangeSelect}
        />
    );
};
