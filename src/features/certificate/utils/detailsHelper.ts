import { TFunction } from "i18next";
import { BonusLesson, Lesson } from "../../types";

export const getStatusTitle = (
    t: TFunction,
    status: "published" | "pending" | undefined
) => {
    if (status === "published") {
        return t("certificate.published");
    }
    if (status === "pending") {
        return t("certificate.unpublished");
    }
    return undefined;
};

export const getStatus = (
    status: "published" | "pending" | undefined
): "success" | "neutral" | undefined => {
    if (status === "published") {
        return "success";
    }
    if (status === "pending") {
        return "neutral";
    }
    return undefined;
};

export const getLessonTitle = (
    lesson: Lesson | null,
    isEditing: boolean,
    isCreating: boolean,
    t: TFunction
) => {
    if (isCreating) {
        return t("certificate.newLesson");
    }
    if (isEditing) {
        return t("certificate.editLesson");
    }
    return lesson?.name ?? "—";
};

export const getBonusLessonTitle = (
    bonusLesson: BonusLesson | null,
    isEditing: boolean,
    isCreating: boolean,
    t: TFunction
) => {
    if (isCreating) {
        return t("certificate.newBonusVideo");
    }
    if (isEditing) {
        return t("certificate.editBonusVideo");
    }
    return bonusLesson?.name ?? "—";
};
