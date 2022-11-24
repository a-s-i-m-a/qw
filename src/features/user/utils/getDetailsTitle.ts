import { TFunction } from "i18next";
import { User } from "../../types";

export const getDetailsTitle = (
    user: User,
    isEditing: boolean,
    isCreating: boolean,
    t: TFunction
) => {
    if (isCreating) {
        return t(`new`, {
            word: t(`${user!.role}.plural_0`).toLowerCase()
        });
    }
    if (isEditing) {
        return t("profileEditing");
    }
    return user!.name ?? "—";
};
