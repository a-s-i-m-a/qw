import { FC, useContext } from "react";
import { FormInput } from "../../../../ui/atoms/FormInput";
import { useTranslation } from "react-i18next";
import { userStore } from "../../store/UserStore";
import { FetchSelect } from "../../../catalogue/ui/molecules/FetchSelect";
import { DirectoryAPI } from "../../../utils/api/requests/directory-requests";
import { UserSectionProps } from "../../types";

export const ExpertSection: FC<UserSectionProps> = ({ isMe }) => {
    const { t } = useTranslation();
    const { isUserEditing } = useContext(userStore);

    return (
        <section className="w-720p grid grid-cols-2 gap-30p mb-12">
            <FormInput
                name={"name"}
                isEditing={isUserEditing}
                label={t("firstAndLastName")}
                autoFocus={true}
            />
            <FetchSelect
                fetchFn={DirectoryAPI.getCountries}
                placeholder={t("chooseCountry")}
                name="country"
                label={t("country")}
                isSearchable={true}
                isEditing={isUserEditing}
            />
            <FormInput
                name={"login"}
                label={"Email"}
                isEditing={isUserEditing}
                isDisabled={isMe}
            />
            <FormInput
                name={"phone"}
                isEditing={isUserEditing}
                label={t("phone")}
                isMaskedNumber={true}
                decimalScale={0}
                allowNegative={false}
                isNumericString={false}
            />
        </section>
    );
};
