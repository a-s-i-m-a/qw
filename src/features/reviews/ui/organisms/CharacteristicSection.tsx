import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "../../../../ui/atoms/FormInput";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { isValueBetween } from "../../../utils/isValueBetween";

interface CharacteristicSectionProps {
    isEditing: boolean;
}
export const CharacteristicSection: FC<CharacteristicSectionProps> = observer(
    ({ isEditing }) => {
        const { t } = useTranslation();

        return (
            <section>
                <SectionHeader title={t("characteristics")} />
                <section className="grid grid-cols-2 gap-10 mt-20p">
                    <FormInput
                        name="tasteScores.body"
                        label={t("body")}
                        isMaskedNumber={true}
                        decimalScale={0}
                        allowNegative={false}
                        isEditing={isEditing}
                        description={t("typeValueRange", {
                            min: 1,
                            max: 10
                        })}
                        isAllowed={({ floatValue }) =>
                            floatValue === undefined ||
                            isValueBetween(floatValue, 1, 10)
                        }
                    />
                    <FormInput
                        name="tasteScores.tannin"
                        label={t("tannin")}
                        isMaskedNumber={true}
                        decimalScale={0}
                        allowNegative={false}
                        isEditing={isEditing}
                        description={t("typeValueRange", {
                            min: 1,
                            max: 10
                        })}
                        max={10}
                        isAllowed={({ floatValue }) =>
                            floatValue === undefined ||
                            isValueBetween(floatValue, 1, 10)
                        }
                    />
                    <FormInput
                        name="tasteScores.sweetness"
                        label={t("sweetness")}
                        isMaskedNumber={true}
                        decimalScale={0}
                        allowNegative={false}
                        isEditing={isEditing}
                        description={t("typeValueRange", {
                            min: 1,
                            max: 10
                        })}
                        isAllowed={({ floatValue }) =>
                            floatValue === undefined ||
                            isValueBetween(floatValue, 1, 10)
                        }
                    />
                    <FormInput
                        name="tasteScores.acidity"
                        label={t("acidity")}
                        isMaskedNumber={true}
                        decimalScale={0}
                        allowNegative={false}
                        isEditing={isEditing}
                        description={t("typeValueRange", {
                            min: 1,
                            max: 10
                        })}
                        isAllowed={({ floatValue }) =>
                            floatValue === undefined ||
                            isValueBetween(floatValue, 1, 10)
                        }
                    />
                </section>
            </section>
        );
    }
);
