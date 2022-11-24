import { FC } from "react";
import { useTranslation } from "react-i18next";

interface EmptyCertificatesProps {
    page: "certificate" | "levels" | "blocks" | "bonusLesson";
}

export const EmptyCertificates: FC<EmptyCertificatesProps> = ({ page }) => {
    const { t } = useTranslation();

    return (
        <section className="flex flex-col items-center justify-center flex-1 mx-auto h-3/4">
            <h4 className="font-semibold text-18 text-gray-text text-center">
                {page === "certificate" && t("certificate.emptyDescription")}
                {page === "levels" && t("certificate.emptyLevelDescription")}
                {page === "blocks" && t("certificate.emptyBlockDescription")}
                {page === "bonusLesson" &&
                    t("certificate.emptyBonusLessonDescription")}
            </h4>
        </section>
    );
};
