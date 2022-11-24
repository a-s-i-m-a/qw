import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { Select } from "../../../../ui/atoms/Select";
import { transformObjectToOption } from "../../../catalogue/utils/objectUtils";
import { Tastes } from "../../../types";

const tasteOptions = transformObjectToOption(Tastes);

interface AromaSectionProps {
    isEditing: boolean;
}
export const AromaSection: FC<AromaSectionProps> = observer(({ isEditing }) => {
    const { t } = useTranslation();

    return (
        <section>
            <SectionHeader title={t("aroma")} />
            <section className="grid grid-cols-2 gap-10 mt-20p">
                <Select
                    name="tasteKinds.first"
                    placeholder={t("typeTasteKind")}
                    defaultOptions={tasteOptions}
                    label={t("tasteKinds.first")}
                    isEditing={isEditing}
                    needTranslation={true}
                />
                <Select
                    name="tasteKinds.second"
                    placeholder={t("typeTasteKind")}
                    defaultOptions={tasteOptions}
                    label={t("tasteKinds.second")}
                    isEditing={isEditing}
                    needTranslation={true}
                />
                <Select
                    name="tasteKinds.third"
                    placeholder={t("typeTasteKind")}
                    defaultOptions={tasteOptions}
                    label={t("tasteKinds.third")}
                    isEditing={isEditing}
                    needTranslation={true}
                />
            </section>
        </section>
    );
});
