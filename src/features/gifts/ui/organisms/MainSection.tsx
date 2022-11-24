import { observer } from "mobx-react-lite";
import { useCallback, useContext, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormInput } from "../../../../ui/atoms/FormInput";
import {
    FormTextarea,
    FormTextareaProps
} from "../../../../ui/atoms/FormTextarea";
import { LanguageTabChanger } from "../../../../ui/organisms/LanguageTabChanger";
import { Languages } from "../../../types";
import { giftsStore } from "../../store/GiftsStore";

export const MainSection = observer(() => {
    const { t } = useTranslation();
    const { isEditing } = useContext(giftsStore);
    const { unregister } = useFormContext();
    const values = useWatch({
        name: ["name", "description"]
    });
    const language = useWatch({ name: "lang" });

    const TextAreaWithLang = useCallback(
        ({ isEditing, name, label }: Partial<FormTextareaProps>) => (
            <FormTextarea
                name={`${name}.${language.value}`}
                className="col-span-2 mt-10p"
                textareaClasses="min-h-170p resize-none"
                label={label}
                defaultValue=""
                isEditing={isEditing}
                maxLength={600}
            />
        ),
        [language]
    );
    const FormInputWithLang = useCallback(
        ({ isEditing, name, label }: Partial<FormTextareaProps>) => (
            <FormInput
                name={`${name}.${language.value}`}
                label={label}
                isEditing={isEditing}
                defaultValue=""
                maxLength={120}
                className="col-span-2"
            />
        ),
        [language]
    );

    useEffect(() => {
        // for correct validation we should unregister empty fields
        values[0] &&
            Object.entries(values[0]).forEach(nameDeskWithLang => {
                const [lang, value] = nameDeskWithLang;
                if (lang === language.value) {
                    return;
                }
                value === "" &&
                    unregister(`name.${lang as Languages}`, {
                        keepError: true
                    });
            });

        values[1] &&
            Object.entries(values[1]).forEach(descriptionDeskWithLang => {
                const [lang, value] = descriptionDeskWithLang;
                if (lang === language.value) {
                    return;
                }
                value === "" &&
                    unregister(`description.${lang as Languages}`, {
                        keepError: true
                    });
            });
    }, [language.value, unregister, values]);

    return (
        <>
            <section className="grid grid-cols-2 gap-10 mt-20p mb-60p">
                <LanguageTabChanger name="lang" />
                <FormInputWithLang
                    name={"name"}
                    label={t("title")}
                    isEditing={isEditing}
                />
                <TextAreaWithLang
                    name={"description"}
                    label={t("description")}
                    isEditing={isEditing}
                />
            </section>
        </>
    );
});
