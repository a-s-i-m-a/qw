import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormInput, FormInputProps } from "../../../../ui/atoms/FormInput";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { Languages } from "../../../types";
import { VideoInstructions } from "../molecules/VideoInstructions";

interface VideoDetailsProps {
    isEditing: boolean;
}

export const VideoDetails: FC<VideoDetailsProps> = observer(({ isEditing }) => {
    const { t } = useTranslation();
    const language = useWatch({ name: "currentLang" });

    const links = useWatch({ name: "links" });
    const { unregister } = useFormContext();
    const InputWithLang = useCallback(
        ({ isEditing, label, placeholder }: Partial<FormInputProps>) => (
            <FormInput
                name={`links.${language.value}`}
                label={label}
                isEditing={isEditing}
                placeholder={placeholder}
                className="mt-30p w-full"
                // important
                defaultValue=""
                renderValue={value => (
                    <a
                        rel="noreferrer"
                        target="_blank"
                        href={value}
                        className="block truncate underline"
                    >
                        {value}
                    </a>
                )}
            />
        ),
        [language]
    );

    useEffect(() => {
        // for correct validation we should unregister empty fields
        links &&
            Object.entries(links).forEach(linkWithLang => {
                const [lang, value] = linkWithLang;
                if (lang === language.value) {
                    return;
                }
                value === "" &&
                    unregister(`links.${lang as Languages}`, {
                        keepError: true
                    });
            });
    }, [language, links, unregister]);
    return (
        <section>
            <SectionHeader title={t("video.plural_0")} />
            <section className="p-30p rounded-20p border-gray-bg border-2 mt-5">
                <VideoInstructions />
                <InputWithLang
                    isEditing={isEditing}
                    label={t("url")}
                    placeholder={t("url")}
                />
            </section>
        </section>
    );
});
