import { useTranslation } from "react-i18next";

export const EmptyState = () => {
    const { t } = useTranslation();

    return (
        <section className="flex flex-col items-center justify-center flex-1 mx-auto">
            <h4 className="font-semibold text-18 text-gray-text text-center">
                {t("noSearchResult")}
            </h4>
        </section>
    );
};
