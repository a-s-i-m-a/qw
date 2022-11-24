import { FC, useContext } from "react";
import { FormInput } from "../../../../ui/atoms/FormInput";
import { useTranslation } from "react-i18next";
import { userStore } from "../../store/UserStore";
import { UserSectionProps } from "../../types";

export const MainSection: FC<UserSectionProps> = ({ isMe }) => {
    const { t } = useTranslation();
    const { isUserEditing } = useContext(userStore);

    return (
        <section className="w-720p grid grid-cols-2 gap-30p mb-12">
            <FormInput
                name={"name"}
                isEditing={isUserEditing}
                label={t("firstAndLastName")}
                autoFocus={true}
            />
            <FormInput
                name={"phone"}
                isEditing={isUserEditing}
                label={t("phone")}
                isMaskedNumber={true}
                decimalScale={0}
                allowNegative={false}
                isNumericString={false}
            />
            <FormInput
                name={"login"}
                label={"Email"}
                isDisabled={isMe}
                isEditing={isUserEditing}
                
            />
        </section>
    );
};
