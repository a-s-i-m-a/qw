import React, { FC } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormInput } from "../../../../ui/atoms/FormInput";
import { PageSpinner } from "../../../../ui/atoms/PageSpinner";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { VideoUpload } from "../../../../ui/atoms/VideoUpload";

interface VideoSectionProps {
    isLoading: boolean;
    isEditing: boolean;
}

export const VideoSection: FC<VideoSectionProps> = ({
    isLoading,
    isEditing
}) => {
    const { t } = useTranslation();
    const name = useWatch({ name: "name" });
    return (
        <section>
            <SectionHeader title={t("video.plural_0")} />
            <section className="p-30p rounded-20p border-gray-bg border-2 mt-5">
                <div className="flex flex-row justify-between">
                    <FormInput
                        className="w-490p"
                        inputClasses="focus:bg-gray-bg"
                        name="name"
                        label={t("label")}
                        description={`${name.length} / 50`}
                        max={50}
                        isEditing={isEditing}
                    />
                    <FormInput
                        className="w-150p"
                        name="sortNumber"
                        label={t("certificate.serialNumber")}
                        isEditing={isEditing}
                    />
                </div>
                {!isLoading ? (
                    <VideoUpload
                        name="video"
                        isEditing={isEditing} 
                    />
                ) : (
                    <div className="h-40p mt-20p">
                        <PageSpinner />
                    </div>
                )}
            </section>
        </section>
    );
};
