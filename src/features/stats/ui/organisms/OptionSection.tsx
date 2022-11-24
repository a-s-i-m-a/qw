import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FetchSelect } from "../../../catalogue/ui/molecules/FetchSelect";
import { DirectoryAPI } from "../../../utils/api/requests/directory-requests";
import { getPeriodTabs } from "../../utils/getOptions";
import { SelectPeriodTabs } from "../molecules/SelectPeriodTabs";

interface OptionSectionProps {
    onChangeSelect: () => void;
}

export const OptionSection: FC<OptionSectionProps> = ({ onChangeSelect }) => {
    const { t } = useTranslation();
    const { watch } = useFormContext();

    return (
        <>
            <span className="flex flex-row">
                <SelectPeriodTabs name="period" options={getPeriodTabs(t)} />
            </span>
            <FetchSelect
                fetchFn={DirectoryAPI.getCountries}
                placeholder={t("stats.chooseManufacturerCountry")}
                name="country"
                label={t("manufacturerCountry")}
                isSearchable={true}
                isEditing={true}
                className="mt-20p"
                onChangeSelect={onChangeSelect}
            />
            <FetchSelect
                fetchFn={DirectoryAPI.getManufacturers}
                placeholder={t("stats.chooseManufacturer")}
                label={t("manufacturer.plural_0")}
                name="manufacturer"
                isEditing={true}
                isSearchable={true}
                className="mt-20p"
                extraArgs={{
                    countryId: watch("country")?.value
                }}
                key={watch("country")?.value}
            />
        </>
    );
};
