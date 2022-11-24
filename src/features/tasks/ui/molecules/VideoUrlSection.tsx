import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "../../../../ui/atoms/FormInput";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import validUrl from "valid-url";
import { VideoInstructions } from "../../../videos/ui/molecules/VideoInstructions";

interface VideoUrlSectionProps {
    isEditing: boolean;
}

export const VideoUrlSection: FC<VideoUrlSectionProps> = observer(
    ({ isEditing }) => {
        const { t } = useTranslation();

        return (
            <section>
                <SectionHeader title={t("video.plural_0")} />
                <section className="p-30p rounded-20p border-gray-bg border-2 mt-5">
                    <VideoInstructions />
                    <FormInput
                        name={`videoUrl`}
                        isEditing={isEditing}
                        label={t("url")}
                        placeholder={t("url")}
                        className="mt-30p w-full"
                        defaultValue=""
                        renderValue={value => {
                            const isValid = validUrl.isUri(value);
                            if (!isValid) {
                                return <span className="block">{value}</span>;
                            }
                            return (
                                <a
                                    rel="noreferrer"
                                    target="_blank"
                                    href={value}
                                    className="block truncate underline"
                                >
                                    {value}
                                </a>
                            );
                        }}
                    />
                </section>
            </section>
        );
    }
);
