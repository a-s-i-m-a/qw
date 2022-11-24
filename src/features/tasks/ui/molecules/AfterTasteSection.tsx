import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "../../../../ui/atoms/FormInput";
import { FormTextarea } from "../../../../ui/atoms/FormTextarea";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { isValueBetween } from "../../../utils/isValueBetween";

interface AfterTasteSectionProps {
    isEditing: boolean;
}
export const AfterTasteSection: FC<AfterTasteSectionProps> = observer(
    ({ isEditing }) => {
        const { t } = useTranslation();

        return (
            <section>
                <SectionHeader title={t("aftertasteDuration")} />
                <section className="grid grid-cols-2 gap-10 mt-20p">
                    <FormTextarea
                        textareaClasses="min-h-170p resize-none"
                        name={`aftertasteDescription`}
                        label={t("aftertasteDescription")}
                        isEditing={isEditing}
                        className="col-span-2"
                        maxLength={400}
                    />
                    <FormInput
                        name="aftertasteDuration"
                        label={t("aftertasteDurationInSec")}
                        isMaskedNumber={true}
                        decimalScale={0}
                        allowNegative={false}
                        isEditing={isEditing}
                        description={t("typeValueRange", {
                            min: 1,
                            max: 15
                        })}
                        isAllowed={({ floatValue }) =>
                            floatValue === undefined ||
                            isValueBetween(floatValue, 1, 15)
                        }
                    />
                </section>
            </section>
        );
    }
);
