import { observer } from "mobx-react-lite";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { authStore } from "../../../auth/store/AuthStore";
import { promotionStore } from "../../store/PromotionStore";
import { BonusMultiplying } from "../molecules/BonusMultiplying";
import { WineDiscount } from "../molecules/WineDiscount";
import { WineReview } from "../molecules/WineReview";
import { WineVideo } from "../molecules/WineVideo";

export const FeaturesSection = observer(() => {
    const { t } = useTranslation();
    const { promo, isEditing, forceProduct } = useContext(promotionStore);
    const { user } = useContext(authStore);

    const hideToggle = useMemo(
        () => user?.role === "manufacturer" && promo?.status === "new",
        [promo?.status, user?.role]
    );

    return (
        <section>
            {!promo && (
                <h2 className="text-14 leading-5 mb-5">
                    {t("choosePromotionInstrument")}
                </h2>
            )}
            <BonusMultiplying isEditing={isEditing} hideToggle={hideToggle} />
            <WineDiscount
                isEditing={isEditing}
                currentPriceName="product.price"
                isAvailableForSale={forceProduct?.isAvailableForSale}
                hideToggle={hideToggle}
            />
            <WineVideo
                isEditing={isEditing}
                productId={forceProduct?._id}
                hideToggle={hideToggle}
            />
            <WineReview
                isEditing={isEditing}
                productId={forceProduct?._id}
                hideToggle={hideToggle}
            />
        </section>
    );
});
