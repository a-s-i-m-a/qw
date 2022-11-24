import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { FetchSelect } from "../../../catalogue/ui/molecules/FetchSelect";
import { CatalogueAPI } from "../../../utils/api/requests/catalogue-requests";

interface WineSectionProps {
    isEditing: boolean;
    isDisabled?: boolean;
}
export const WineSection: FC<WineSectionProps> = observer(
    ({ isEditing, isDisabled }) => {
        const { t } = useTranslation();
        return (
            <section>
                <SectionHeader title={t("wine")} />
                <FetchSelect
                    fetchFn={CatalogueAPI.getList}
                    placeholder={t("chooseWineName")}
                    label={t("chooseWine")}
                    name="productId"
                    extraArgs={{ isDeleted: false }}
                    isEditing={isEditing}
                    isSearchable={true}
                    className="mt-5"
                    isDisabled={isDisabled}
                />
            </section>
        );
    }
);
