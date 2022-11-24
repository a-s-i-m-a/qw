import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { FetchSelect } from "../../../catalogue/ui/molecules/FetchSelect";
import { UserAPI } from "../../../utils/api/requests/user-requests";

interface UserDetailsProps {
    isEditing: boolean;
    isDisabled?: boolean;
}
export const UserDetails: FC<UserDetailsProps> = observer(
    ({ isEditing, isDisabled }) => {
        const { t } = useTranslation();
        return (
            <section>
                <SectionHeader title={t("performer")} />
                <FetchSelect
                    fetchFn={UserAPI.getList}
                    placeholder={t("name")}
                    label={t("name")}
                    name="expert"
                    extraArgs={{ role: "expert" }}
                    isEditing={isEditing}
                    isDisabled={isDisabled}
                    isSearchable={true}
                    className="mt-5"
                />
            </section>
        );
    }
);
