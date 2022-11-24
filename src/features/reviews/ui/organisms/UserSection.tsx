import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { FetchSelect } from "../../../catalogue/ui/molecules/FetchSelect";
import { UserAPI } from "../../../utils/api/requests/user-requests";
import { reviewStore } from "../../store/ReviewStore";

export const UserSection = observer(() => {
    const { t } = useTranslation();
    const { isEditing } = useContext(reviewStore);
    return (
        <section>
            <SectionHeader title={t("performer")} />
            <FetchSelect
                fetchFn={UserAPI.getList}
                placeholder={t("name")}
                label={t("name")}
                name="user"
                extraArgs={{ role: "expert" }}
                isEditing={isEditing}
                isSearchable={true}
                className="mt-5"
            />
        </section>
    );
});
