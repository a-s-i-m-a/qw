import dayjs from "dayjs";
import { TFunction } from "i18next";
import { FC } from "react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormInput } from "../../../../ui/atoms/FormInput";
import { MoneyInput } from "../../../../ui/atoms/MoneyInput";
import { throwErrorToast } from "../../../../ui/organisms/Toaster";
import { discountDateMask } from "../../../catalogue/utils/transformProduct";
import { PriceType, Product } from "../../../types";
import { formatNumber } from "../../../utils/formatNumber";
import { isValueBetween } from "../../../utils/isValueBetween";
import { Accordion } from "./Accordion";

interface WineDiscountProps {
    isEditing: boolean;
    isAvailableForSale?: Product["isAvailableForSale"];
    currentPriceName: string;
    hideDisabled?: boolean;
    hideToggle?: boolean;
}

const dateRenderer = (date: string, t: TFunction) => {
    const isValid = dayjs(date, discountDateMask).isValid();

    if (!isValid) {
        return t("forever");
    }
    return date;
};
export const WineDiscount: FC<WineDiscountProps> = ({
    isEditing,
    isAvailableForSale = true,
    currentPriceName,
    hideDisabled = true,
    hideToggle
}) => {
    const { t } = useTranslation();

    const { setValue } = useFormContext();

    const {
        field: { value, onChange }
    } = useController({
        name: "discountInstrument.isEnabled"
    });

    const price = useWatch({ name: currentPriceName }) as PriceType;
    const discount = useWatch({
        name: "discountInstrument.discountPrice"
    }) as PriceType;

    useEffect(() => {
        if (price && discount) {
            const percent = formatNumber({
                value: Math.ceil((1 - discount.value / price.value) * 100),
                decimalScale: 2
            });
            setValue("discountInstrument.percent", percent, {
                shouldDirty: false
            });
        }
    }, [discount, price, setValue]);

    if (!isEditing && value === false && hideDisabled) {
        return null;
    }
    const handleChange = (flag: boolean) => {
        if (isAvailableForSale) {
            onChange(flag);
        } else {
            throwErrorToast(
                t("wineNotInSale"),
                t("youCouldntAddDiscountToNotSaleWine")
            );
        }
    };

    return (
        <Accordion
            value={value}
            onChange={handleChange}
            description={t("promotionFeatures.addDiscountToProductMsg")}
            title={t("wineDiscount")}
            className="mb-20p"
            isEditing={isEditing}
            hideToggle={hideToggle}
        >
            <section className="w-full grid grid-cols-3 gap-20p">
                <MoneyInput
                    label={t("priceWithDiscount")}
                    name="discountInstrument.discountPrice"
                    isCurrencyDisabled={true}
                    isDisabled={!price}
                    isAllowed={({ floatValue }) =>
                        floatValue === undefined ||
                        isValueBetween(floatValue, 0, price.value / 100)
                    }
                    isEditing={isEditing}
                />

                <FormInput
                    label={t("amountOfDiscount")}
                    name="discountInstrument.percent"
                    isMaskedNumber={true}
                    allowNegative={false}
                    isAllowed={({ floatValue }) =>
                        floatValue === undefined ||
                        isValueBetween(floatValue, 0, 100)
                    }
                    suffix="%"
                    isDisabled={true}
                    defaultValue={0}
                    decimalScale={2}
                    isEditing={isEditing}
                />
                <FormInput
                    label={t("validUntil")}
                    placeholder={t("dateMask")}
                    isMaskedNumber={true}
                    format="##.##.####"
                    name="discountInstrument.endDate"
                    isEditing={isEditing}
                    isNumericString={false}
                    renderValue={value => dateRenderer(value, t)}
                />
            </section>
        </Accordion>
    );
};
