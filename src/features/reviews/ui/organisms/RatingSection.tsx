import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Rating100Violet } from "../../../../ui/atoms/Icon";
import { Rating } from "../../../catalogue/ui/molecules/Rating";

interface RatingSectionProps {
    isEditing: boolean;
}
export const RatingSection: FC<RatingSectionProps> = observer(
    ({ isEditing }) => {
        const { t } = useTranslation();

        return (
            <section className="grid grid-cols-2 gap-10 mt-20p">
                <Rating
                    label={t("wineRating")}
                    isEditing={isEditing}
                    Icon={Rating100Violet}
                    name="rating"
                    max={100}
                    min={0}
                    formLabel={t("expertRating")}
                    bottomDescription={t("typeValueRange", {
                        min: 0,
                        max: 100
                    })}
                />
            </section>
        );
    }
);
