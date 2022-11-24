import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    FormTextarea,
    FormTextareaProps
} from "../../../../ui/atoms/FormTextarea";
import { LanguageTabChanger } from "../../../../ui/organisms/LanguageTabChanger";
import { Languages } from "../../../types";

interface WineDescriptionSectionProps {
    isEditing: boolean;
}
export const WineDescriptionSection: FC<WineDescriptionSectionProps> = observer(
    ({ isEditing }) => {
        const { t } = useTranslation();
        const language = useWatch({ name: "lang" });
        const values = useWatch({
            name: ["expertText", "expertAftertasteDescription"]
        });
        const { unregister } = useFormContext();
        const TextAreaWithLang = useCallback(
            ({ isEditing, name, label }: Partial<FormTextareaProps>) => (
                <FormTextarea
                    name={`${name}.${language.value}`}
                    textareaClasses="min-h-170p resize-none"
                    label={label}
                    defaultValue=""
                    isEditing={isEditing}
                    maxLength={400}
                />
            ),
            [language]
        );

        useEffect(() => {
            // for correct validation we should unregister empty fields
            values[0] &&
                Object.entries(values[0]).forEach(wineDescWithLang => {
                    const [lang, value] = wineDescWithLang;
                    if (lang === language.value) {
                        return;
                    }
                    value === "" &&
                        unregister(`expertText.${lang as Languages}`, {
                            keepError: true
                        });
                });

            values[1] &&
                Object.entries(values[1]).forEach(aftertasteDeskWithLang => {
                    const [lang, value] = aftertasteDeskWithLang;
                    if (lang === language.value) {
                        return;
                    }
                    value === "" &&
                        unregister(
                            `expertAftertasteDescription.${lang as Languages}`,
                            { keepError: true }
                        );
                });
        }, [language.value, unregister, values]);
        return (
            <section className="grid gap-10">
                <LanguageTabChanger name="lang" />
                <TextAreaWithLang
                    name="expertText"
                    label={t("wineDescription")}
                    isEditing={isEditing}
                />
                <TextAreaWithLang
                    name="expertAftertasteDescription"
                    label={t("aftertasteDescription")}
                    isEditing={isEditing}
                />
            </section>
        );
    }
);
