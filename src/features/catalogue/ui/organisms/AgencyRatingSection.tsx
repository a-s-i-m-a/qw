import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AGENT_RATINGS } from "../../consts";
import { catalogueStore } from "../../store/CatalogueStore";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { Rating } from "../molecules/Rating";

export const AgencyRatingSection: FC = observer(() => {
    const { t } = useTranslation();
    const { isProductEditing } = useContext(catalogueStore);

    return (
        <>
            <SectionHeader title={t("agencyRatings")} />
            <section className="grid grid-cols-2 gap-10 mt-20p">
                {AGENT_RATINGS.map((agency, index) => (
                    <Rating
                        key={agency.code}
                        code={agency.code}
                        label={agency.title}
                        Icon={agency.Icon}
                        allowDecimal={agency.allowDecimal}
                        name={`agencyRatings[${index}].rating`}
                        max={agency.max}
                        min={agency.min}
                        isEditing={isProductEditing}
                        formLabel={t("value")}
                        bottomDescription={t("typeValueRange", {
                            min: agency.min,
                            max: agency.max
                        })}
                    />
                ))}
            </section>
        </>
    );
});
