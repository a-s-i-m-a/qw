import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Toggle } from "../../../../ui/atoms/Toggle";
import { giftsStore } from "../../store/GiftsStore";

export const ToggleAvailability = observer(() => {
    const { t } = useTranslation();
    const { isEditing } = useContext(giftsStore);

    const { control } = useFormContext();
    const {
        field: { value, onChange }
    } = useController({
        name: "saleStatus",
        control
    });
    const toggle = () => onChange(!value);

    return (
        <section className="mb-40p">
            <section className="h-30p flex items-center mb-5p">
                <h3 className="text-14 font-semibold">
                    {t("gift.availableForSale")}
                </h3>
                <Toggle
                    onChange={toggle}
                    isChecked={value}
                    isDisabled={!isEditing}
                    className="ml-20p"
                />
            </section>
        </section>
    );
});
