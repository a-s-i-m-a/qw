import React from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "../../../../ui/atoms/FormInput";
import { FormTextarea } from "../../../../ui/atoms/FormTextarea";

export const LevelSection = () => {
    const { t } = useTranslation();
    return (
        <section className="flex flex-row mb-50p">
            <FormInput
                className="w-150p"
                name="sortNumber"
                label={t("certificate.serialNumber")}
                isEditing={false}
            />
            <FormTextarea
                className="w-555p ml-50p"
                name="description"
                label={t("description")}
                isEditing={false}
            />
        </section>
    );
};
