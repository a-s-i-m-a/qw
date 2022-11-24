import { useTranslation } from "react-i18next";
export const Empty = () => {
    const { t } = useTranslation();
    return (
        <>
            <section className="w-500p flex flex-col items-center justify-center flex-1 mx-auto">
                <h4 className="font-semibold text-18 text-gray-text text-center">
                    {t("discounts.emptyDescription1")}
                </h4>
                <h4 className="font-semibold text-18 text-gray-text text-center">
                    {t("discounts.emptyDescription2")}
                </h4>
            </section>
        </>
    );
};
