import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { langTabs } from "../../../ui/organisms/LanguageTabChanger";
import { PageHeader } from "../ui/molecules/PageHeader";
import { Button } from "../../../ui/atoms/Button";
import { OrderDescription } from "../ui/atoms/OrderDescription";
import { authStore } from "../../auth/store/AuthStore";
import { wineryStore } from "../store/WineryStore";
import { ArticleSection } from "../ui/organizms/ArticleSection";
import { transformArticles } from "../../articles/utils/transformArticles";
import { Statistic } from "../ui/atoms/Statistic";
import { PageSpinner } from "../../../ui/atoms/PageSpinner";
import { modalPageStore } from "../../modalpage/store/ModalPageStore";
import { REQUEST_ARTICLE_MODAL } from "../ui/modals/RequestArticleModal";

export const Main = observer(() => {
    const { t } = useTranslation();
    const { user } = useContext(authStore);
    const { loadArticle, article, clear, setLoading, isLoading } = useContext(wineryStore);
    const { openModal } = useContext(modalPageStore);
    const formMethods = useForm({
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: {
            currentLang: langTabs.find(lang => lang.value === "en")
        }
    });
    const { reset } = formMethods;

    const onOrderArticle = () => {
        openModal(REQUEST_ARTICLE_MODAL)
    };

    useEffect(() => {
        if (user?.manufacturer?.articleId) {
            setLoading(true)
            loadArticle(user?.manufacturer?.articleId);
        }
    }, [loadArticle, user, setLoading]);

    useEffect(() => {
        if (article) {
            reset(transformArticles(article));
        }
    }, [reset, article]);

    useEffect(() => {
        return () => clear();
    }, [clear]);

    if (isLoading) {
        return <PageSpinner />;
    }

    return (
        <FormProvider {...formMethods}>
            <form className="px-50p">
                <PageHeader title={t("winery.aboutWinery")} className="mb-34p">
                    <Button
                        htmlType="button"
                        type="primary"
                        text={t("winery.orderArticle")}
                        onClick={onOrderArticle}
                    />
                </PageHeader>
                <section className="w-720p grid grid-cols-1">
                    {article ? (
                        <>
                            <Statistic />
                            <ArticleSection />
                        </>
                    ) : (
                        <OrderDescription />
                    )}
                </section>
            </form>
        </FormProvider>
    );
});
