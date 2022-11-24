import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { QvinoAwardIcon, Rating100White } from "../../../../ui/atoms/Icon";
import { catalogueStore } from "../../store/CatalogueStore";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { Rating } from "../molecules/Rating";
import { useFormContext } from "react-hook-form";

export const RatingsSection: FC = observer(() => {
    const { t } = useTranslation();
    const { isProductEditing } = useContext(catalogueStore);
    const { setValue } = useFormContext();

    const onToggle = (value: boolean) => {
        if (value) {
            setValue("awardYear", new Date().getFullYear());
        } else {
            setValue("awardYear", "");
        }
    };
    return (
        <>
            <SectionHeader title={t("ratings")} />

            <section className="grid grid-cols-2 gap-10 mt-20p mb-60p">
                <Rating
                    label={t("qvino-rating")}
                    isEditing={isProductEditing}
                    Icon={Rating100White}
                    name="qvinoRating"
                    max={100}
                    min={0}
                    formLabel={t("value")}
                    bottomDescription={t("typeValueRange", {
                        min: 0,
                        max: 100
                    })}
                />
                <Rating
                    label={t("qvinoRatingAward")}
                    isEditing={isProductEditing}
                    Icon={QvinoAwardIcon}
                    name="awardYear"
                    formLabel={t("assignmentYear")}
                    awardToggleName="award"
                    onToggle={onToggle}
                />
            </section>
        </>
    );
});
