import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FormTextarea } from "../../../../ui/atoms/FormTextarea";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";

interface WineDescriptionSectionProps {
    isEditing: boolean;
}
export const WineDescriptionSection: FC<WineDescriptionSectionProps> = observer(
    ({ isEditing }) => {
        const { t } = useTranslation();

        return (
            <section>
                <SectionHeader title={t("description")} />
                <FormTextarea
                    name={"text"}
                    textareaClasses="min-h-170p resize-none"
                    isEditing={isEditing}
                    label={t("wineDescription")}
                    className="mt-5"
                    maxLength={400}
                />
            </section>
        );
    }
);
