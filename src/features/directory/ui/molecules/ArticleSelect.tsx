import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { OptionType, Select } from "../../../../ui/atoms/Select";
import { articleListForSelect } from "../../../fields/promo";
import { getSafariFriendlyDate } from "../../../catalogue/utils/getSafariFriendlyDate";
import { DirectoryAPI } from "../../../utils/api/requests/directory-requests";

interface ArticleSelectProps {
    isEditing?: boolean;
    label?: string;
    id?: string;
    disabled?: boolean;
}
export const ArticleSelect: FC<ArticleSelectProps> = ({
    isEditing,
    label,
    id,
    disabled
}) => {
    const { t } = useTranslation();

    const fetch = useCallback(
        async (value: string) => {
            const manufacturerId = id;
            const data = await DirectoryAPI.getManufacturerArticles({
                q: value,
                manufacturerId: manufacturerId,
                _fields: articleListForSelect
            });
            return data.items.map(
                article =>
                    ({
                        label: `${
                            article?.manufacturer.name
                        } (${getSafariFriendlyDate(article.createDate).format(
                            "DD.MM.YYYY"
                        )})`,
                        value: article._id
                    } as OptionType)
            );
        },
        [id]
    );

    return (
        <Select
            defaultOptions={true}
            isEditing={isEditing}
            loadOptions={fetch}
            isSearchable={true}
            label={label}
            isDisabled={!disabled}
            placeholder={t("notChosen")}
            name="articles"
            className="px-6 mb-50p"
        />
    );
};
