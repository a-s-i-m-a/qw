import { observer } from "mobx-react-lite";
import { useContext, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { authStore } from "../../../auth/store/AuthStore";
import { BonusMultiplying } from "../../../promotion/ui/molecules/BonusMultiplying";
import { WineDiscount } from "../../../promotion/ui/molecules/WineDiscount";
import { WineReview } from "../../../promotion/ui/molecules/WineReview";
import { WineVideo } from "../../../promotion/ui/molecules/WineVideo";
import { catalogueStore } from "../../store/CatalogueStore";
import { Program } from "../molecules/Program";

export const PromoTab = observer(() => {
    const { product, isProductEditing } = useContext(catalogueStore);
    const { user } = useContext(authStore);
    const instruments = useWatch({
        name: [
            "bonusInstrument.isEnabled",
            "discountInstrument.isEnabled",
            "reviewInstrument.isEnabled",
            "videoInstrument.isEnabled"
        ]
    });
    const needPlaceholder = useMemo(
        () =>
            user?.role === "manufacturer" &&
            !instruments.reduce((acc, value) => acc || value, false),
        [instruments, user?.role]
    );
    return (
        <section className="w-720p">
            {needPlaceholder ? (
                <Program />
            ) : (
                <>
                    <BonusMultiplying
                        isEditing={
                            isProductEditing && user?.role !== "manufacturer"
                        }
                        hideDisabled={user?.role === "manufacturer"}
                        hideToggle={user?.role === "manufacturer"}
                    />
                    <WineDiscount
                        currentPriceName={"price"}
                        isEditing={
                            isProductEditing && user?.role !== "manufacturer"
                        }
                        hideDisabled={user?.role === "manufacturer"}
                        isAvailableForSale={product?.isAvailableForSale}
                        hideToggle={user?.role === "manufacturer"}
                    />
                    <WineVideo
                        isEditing={
                            isProductEditing && user?.role !== "manufacturer"
                        }
                        productId={product?._id}
                        hideDisabled={user?.role === "manufacturer"}
                        hideToggle={user?.role === "manufacturer"}
                    />
                    <WineReview
                        isEditing={
                            isProductEditing && user?.role !== "manufacturer"
                        }
                        productId={product?._id}
                        hideDisabled={user?.role === "manufacturer"}
                        hideToggle={user?.role === "manufacturer"}
                    />
                </>
            )}
        </section>
    );
});
