import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DirectoryAPI } from "../../../utils/api/requests/directory-requests";
import { articlesStore } from "../../store/ArticlesStore";
import { FetchSelect } from "../../../catalogue/ui/molecules/FetchSelect";

export const ManufacturerSection = observer(() => {
    const { t } = useTranslation();
    const { isEditing } = useContext(articlesStore);

    return (
        <>
            <section className="grid gap-10 mt-5p">
                <FetchSelect
                    fetchFn={DirectoryAPI.getManufacturers}
                    placeholder={t("notChosen")}
                    label={t("manufacturer.plural_0")}
                    name="manufacturer"
                    isEditing={isEditing}
                    isSearchable={true}
                />
            </section>
        </>
    );
});
