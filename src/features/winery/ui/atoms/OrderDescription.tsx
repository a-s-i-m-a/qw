import { useTranslation } from "react-i18next";

export const OrderDescription = () => {
    const { t } = useTranslation();
    return (
        <div className="w-552p text-14">
            <p>{t("winery.orderArticleDescr1")}</p>
            <br />
            <p>{t("winery.orderArticleDescr2")}</p>
        </div>
    );
};
