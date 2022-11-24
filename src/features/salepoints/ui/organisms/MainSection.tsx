import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "../../../../ui/atoms/FormInput";

interface MainSectionProps {
    isEditing: boolean;
}

export const MainSection: FC<MainSectionProps> = ({ isEditing }) => {
    const { t } = useTranslation();
    return (
        <section className="flex row mb-40p">
            <FormInput
                name="location.city"
                label={t("salepoints.city")}
                className="w-full mr-40p"
                isEditing={isEditing}
            />
            <FormInput
                name="location.address"
                label={t("salepoints.address")}
                className="w-full"
                isEditing={isEditing}
            />
        </section>
    );
};
