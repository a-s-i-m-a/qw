import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { giftsStore } from "../../store/GiftsStore";
import { FormInput } from "../../../../ui/atoms/FormInput";

export const PriceSection = observer(() => {
    const { t } = useTranslation();
    const { isEditing } = useContext(giftsStore);
    return (
        <section className="grid grid-cols-2 gap-10 mb-40p">
            <FormInput
                label={t("gift.pricePoints")}
                name="pricePoints"
                isMaskedNumber={true}
                allowNegative={false}
                decimalScale={2}
                isEditing={isEditing}
            />
            <FormInput
                name="stockCount"
                label={t("gift.quantity")}
                isMaskedNumber={true}
                allowNegative={false}
                decimalScale={0}
                isEditing={isEditing}
            />
        </section>
    );
});