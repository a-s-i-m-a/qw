import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "../../../../ui/atoms/Select";

interface LanguageSelectionSectionProps {
    isEditing: boolean;
}
export const languageOptions = [
    {
        label: "English",
        value: "en"
    },
    {
        label: "Russian",
        value: "ru"
    },
    {
        label: "Italian",
        value: "it"
    }
];
export const LanguageSelectionSection: FC<LanguageSelectionSectionProps> = observer(
    ({ isEditing }) => {
        const { t } = useTranslation();

        return (
            <section className="grid grid-cols-2">
                <Select
                    name="lang"
                    placeholder={t("notChosen")}
                    defaultOptions={languageOptions}
                    label={t("chooseLang")}
                    isEditing={isEditing}
                />
            </section>
        );
    }
);
