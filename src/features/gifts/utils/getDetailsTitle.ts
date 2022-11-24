import i18n, { TFunction } from "i18next";
import { Gift, Languages } from "../../types";

export const getDetailsTitle = (
    gift: Gift | null,
    isEditing: boolean,
    t: TFunction
) => {
    const currentLang: Languages = i18n.language as Languages;
    return gift
        ? isEditing
            ? t("positionEditing")
            : gift.name[currentLang]
        : t("gift.newGift");
};
