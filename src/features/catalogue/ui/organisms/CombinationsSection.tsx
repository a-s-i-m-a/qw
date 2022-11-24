import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "../../../../ui/atoms/Select";
import { Gastronomies } from "../../../types";
import { catalogueStore } from "../../store/CatalogueStore";
import { transformObjectToOption } from "../../utils/objectUtils";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";

const gastroOptions = transformObjectToOption(Gastronomies);

export const CombinationsSection = observer(() => {
    const { t } = useTranslation();
    const { isProductEditing } = useContext(catalogueStore);

    return (
        <>
            <SectionHeader title={t("combinationWithDishes")} />
            <Select
                name="gastronomies"
                defaultOptions={gastroOptions}
                placeholder={t("chooseDishes")}
                label={t("gastronomy")}
                isMulti={true}
                isEditing={isProductEditing}
                className="mb-60p mt-20p"
                needTranslation={true}
            />
        </>
    );
});
