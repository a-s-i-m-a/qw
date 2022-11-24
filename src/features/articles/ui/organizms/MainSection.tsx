import { observer } from "mobx-react-lite";
import { useCallback, useContext, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    FormTextarea,
    FormTextareaProps
} from "../../../../ui/atoms/FormTextarea";
import { ImageUpload, ImageUploadProps } from "../molecules/ImageUpload";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { LanguageTabChanger } from "../../../../ui/organisms/LanguageTabChanger";
import { Languages } from "../../../types";
import { articlesStore } from "../../store/ArticlesStore";

export const MainSection = observer(
    ({ viewOnly = false }: { viewOnly?: boolean }) => {
        const { t } = useTranslation();
        const { isEditing } = useContext(articlesStore);
        const { unregister } = useFormContext();
        const values = useWatch({
            name: ["cover", "description"]
        });
        const language = useWatch({ name: "currentLang" });

        const TextAreaWithLang = useCallback(
            ({ isEditing, name, label }: Partial<FormTextareaProps>) => (
                <FormTextarea
                    name={`${name}.${language.value}`}
                    className="col-span-2 mt-10p"
                    textareaClasses="min-h-170p resize-none"
                    label={label}
                    defaultValue=""
                    isEditing={isEditing}
                    hideLabel={true}
                    maxLength={600}
                />
            ),
            [language]
        );

        const ImageUploadWithLang = useCallback(
            ({ isDisabled, name }: Partial<ImageUploadProps>) => (
                <ImageUpload
                    name={`${name}.${language.value}`}
                    isDisabled={!isEditing}
                    objectFit="cover"
                    minImgDimension={280}
                    viewOnly={viewOnly}
                />
            ),
            [language, isEditing, viewOnly]
        );

        useEffect(() => {
            // for correct validation we should unregister empty fields
            values[0] &&
                Object.entries(values[0]).forEach(coverWithLang => {
                    const [lang, value] = coverWithLang;
                    if (lang === language.value) {
                        return;
                    }
                    value === undefined &&
                        unregister(`cover.${lang as Languages}`, {
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
                <section className="grid gap-10 mt-10p">
                    <LanguageTabChanger name="currentLang" />
                    <div className="mt-10p">
                        <SectionHeader title={t("articles.cover")} />
                        <div className="mt-20p">
                            <ImageUploadWithLang name="cover" />
                        </div>
                    </div>
                    <div>
                        <SectionHeader title={t("articles.shortDescription")} />
                        <div className="mt-20p">
                            <TextAreaWithLang
                                name={"description"}
                                label={
                                    isEditing
                                        ? t("articles.textBlock")
                                        : undefined
                                }
                                isEditing={isEditing}
                            />
                        </div>
                    </div>
                </section>
            </>
        );
    }
);
