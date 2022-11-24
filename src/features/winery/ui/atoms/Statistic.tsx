import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { wineryStore } from "../../store/WineryStore";

export const Statistic = () => {
    const { t } = useTranslation();
    const { article } = useContext(wineryStore);
    return (
        <section className="flex row text-14 text-gray-text mb-30p">
            <p className="mr-50p">{t("winery.articlesViews",{ count: article?.viewCount ?? 0 })}</p>
            <p>{t("winery.quizCount",{ count: article?.quizCount ?? 0 })}</p>
        </section>
    );
};
