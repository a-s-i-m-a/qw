import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { catalogueStore } from "../../store/CatalogueStore";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { Select } from "../../../../ui/atoms/Select";
import {
    ACIDITY_OPTIONS,
    SWEETNESS_OPTIONS,
    TANNIN_OPTIONS
} from "../../consts";

export const CharacteristicSection = observer(() => {
    const { t } = useTranslation();
    const { isProductEditing } = useContext(catalogueStore);

    return (
        <>
            <SectionHeader title={t("characteristics")} />

            <section className="grid grid-cols-2 gap-10 mt-20p mb-60p">
                <Select
                    name="taste.sweetness"
                    defaultOptions={SWEETNESS_OPTIONS}
                    placeholder={t("notChosen")}
                    label={t("sweetnessInUnits")}
                    isEditing={isProductEditing}
                    needTranslation={true}
                />
                <Select
                    name="taste.acidity"
                    defaultOptions={ACIDITY_OPTIONS}
                    placeholder={t("notChosen")}
                    label={t("acidityInUnits")}
                    isEditing={isProductEditing}
                    needTranslation={true}
                />
                <Select
                    name="taste.tannin"
                    defaultOptions={TANNIN_OPTIONS}
                    placeholder={t("notChosen")}
                    label={t("tanninInUnits")}
                    isEditing={isProductEditing}
                    needTranslation={true}
                />
            </section>
        </>
    );
});
