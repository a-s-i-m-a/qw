import { Manufacturer } from "./../../types";
import { TFunction } from "i18next";

export const getDetailsTitle = (
    manufacturer: Manufacturer | null,
    isEditing: boolean,
    isCreating: boolean,
    t: TFunction
) => {
    if (isCreating) {
        return t("articles.newArticle");
    }
    if (isEditing) {
        return t("editing");
    }
    return manufacturer?.name ?? "—";
};
