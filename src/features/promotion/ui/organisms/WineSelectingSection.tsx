import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { authStore } from "../../../auth/store/AuthStore";
import { FetchSelect } from "../../../catalogue/ui/molecules/FetchSelect";
import { CatalogueAPI } from "../../../utils/api/requests/catalogue-requests";

interface WineSelectingSectionProps {
    isEditing: boolean;
    isDisabled?: boolean;
}
export const WineSelectingSection: FC<WineSelectingSectionProps> = observer(
    ({ isEditing, isDisabled }) => {
        const { t } = useTranslation();
        const { user } = useContext(authStore);
        return (
            <section>
                <SectionHeader title={t("wineName")} />
                <FetchSelect
                    fetchFn={CatalogueAPI.getList}
                    placeholder={t("chooseWineName")}
                    label={t("chooseWine")}
                    name="productId"
                    isDisabled={isDisabled}
                    extraArgs={{
                        isDeleted: false,
                        role:
                            user?.role === "manufacturer"
                                ? "manufacturer"
                                : "admin"
                    }}
                    isEditing={isEditing}
                    isSearchable={true}
                    className="mt-5"
                />
            </section>
        );
    }
);
