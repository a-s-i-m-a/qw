import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { catalogueStore } from "../../store/CatalogueStore";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { FormInput } from "../../../../ui/atoms/FormInput";
import { MoneyInput } from "../../../../ui/atoms/MoneyInput";
import { authStore } from "../../../auth/store/AuthStore";

export const PriceSection = observer(() => {
    const { t } = useTranslation();
    const { isProductEditing, product } = useContext(catalogueStore);
    const { user } = useContext(authStore)
    return (
        <>
            <SectionHeader title={t("price2")} />

            <section className="grid grid-cols-2 gap-10 mt-20p mb-20p">
                <MoneyInput
                    label={t("price")}
                    name="price"
                    isEditing={isProductEditing}
                    placeholder={t("price")}
                    isDisabled={user?.role === "manufacturer" && product?.isSoldByQvino}
                />
                <FormInput
                    name="stockCount"
                    defaultValue={0}
                    label={t("stockCount")}
                    isMaskedNumber={true}
                    decimalScale={0}
                    min={0}
                    allowNegative={false}
                    placeholder={"0"}
                    isEditing={isProductEditing}
                    isDisabled={user?.role === "manufacturer" && product?.isSoldByQvino}
                />
            </section>
        </>
    );
});
