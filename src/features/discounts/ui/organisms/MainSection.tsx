import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "../../../../ui/atoms/FormInput";
import { FormTextarea } from "../../../../ui/atoms/FormTextarea";
import { MoneyInput } from "../../../../ui/atoms/MoneyInput";
import { FetchSelect } from "../../../catalogue/ui/molecules/FetchSelect";
import { DirectoryAPI } from "../../../utils/api/requests/directory-requests";
import { discountsStore } from "../../store/DiscountsStore";

export const MainSection = () => {
    const { t } = useTranslation();
    const { isEditing } = useContext(discountsStore);
    return (
        <section className="grid grid-cols-1 gap-y-40p">
            <section className="grid grid-cols-2 gap-x-40p">
                <FetchSelect
                    fetchFn={DirectoryAPI.getCountries}
                    placeholder={t("chooseCountry")}
                    name="country"
                    label={t("country")}
                    isSearchable={true}
                    isEditing={isEditing}
                    className="mr-40p"
                />
                <MoneyInput
                    label={t("price")}
                    name="price"
                    isEditing={isEditing}
                    placeholder={t("price")}
                />
            </section>
            <FormInput
                name="name"
                label={t("label")}
                isEditing={isEditing}
                defaultValue=""
                maxLength={120}
                className="col-span-2"
            />
            <FormTextarea
                name="description"
                className="col-span-2 mt-10p"
                textareaClasses="min-h-170p resize-none"
                label={t("discounts.description")}
                defaultValue=""
                isEditing={isEditing}
                maxLength={600}
            />
        </section>
    );
};
