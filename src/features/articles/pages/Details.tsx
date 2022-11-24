import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { joiResolver } from "@hookform/resolvers/joi";
import { useContext, useEffect } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { articlesStore } from "../store/ArticlesStore";
import { DetailsHeader } from "../ui/molecules/DetailsHeader";
import { getArticlesSchema } from "../../utils/schemas/ArticlesSchema";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { langTabs } from "../../../ui/organisms/LanguageTabChanger";
import { ManufacturerSection } from "../ui/organizms/ManufacturerSection";
import { MainSection } from "../ui/organizms/MainSection";
import { QuizSection } from "../../videos/ui/organisms/QuizSection";
import { BlockSection } from "../ui/organizms/BlockSection";
import { PageSpinner } from "../../../ui/atoms/PageSpinner";
import { transformPayload } from "../utils/transformArticles";
import { LangMap, Languages } from "../../types";
import { ArticlePayload } from "../types";
import { uploadFile } from "../../utils/api/requests/file-requests";
import { getDirtyFields } from "../../utils/getDirtyFields";
import { transformArticles } from "../utils/transformArticles";

export const Details = observer(() => {
    const { id } = useParams<Record<"id", string>>();
    const { t } = useTranslation();
    const history = useHistory();
    const isCreating = useRouteMatch("/article/create");

    const {
        loadArticle,
        setEditing,
        updateOrCreateArticle,
        article,
        isEditing,
        clear,
        setSelectedLang,
        selectedLang
    } = useContext(articlesStore);

    const formMethods = useForm<ArticlePayload>({
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: {
            currentLang: langTabs.find(lang => lang.value === "en")
        },
        resolver: joiResolver(getArticlesSchema(t))
    });

    const {
        handleSubmit,
        reset,
        formState,
        setValue,
        clearErrors
    } = formMethods;
    const {
        errors,
        isSubmitted,
        isSubmitting,
        isValid,
        dirtyFields
    } = formState;

    const values = formMethods.watch([
        "cover",
        "description",
        "quiz",
        "currentLang"
    ]);

    useEffect(() => {
        //tab switcher
        if (!isValid) {
            const currentLang = values[3].value;
            const coverError = errors?.["cover"] ?? {};
            const descrError = errors?.["description"] ?? {};
            const quizError = errors?.["quiz"] ?? {};
            const coverErrorLangs = Object.keys(coverError) as Languages[];
            const descrErrorLangs = Object.keys(descrError) as Languages[];
            const quizErrorLangs = Object.keys(
                quizError?.questions ?? {}
            ) as Languages[];

            let switchLang = currentLang as Languages;

            if (!coverErrorLangs.includes(currentLang)) {
                coverErrorLangs.forEach(lang => {
                    if (lang !== currentLang) {
                        switchLang = lang;
                    }
                });
            }
            if (!descrErrorLangs.includes(currentLang)) {
                descrErrorLangs.forEach(lang => {
                    if (lang !== currentLang) {
                        switchLang = lang;
                    }
                });
            }
            if (!quizErrorLangs.includes(currentLang)) {
                quizErrorLangs.forEach(lang => {
                    if (lang !== currentLang) {
                        switchLang = lang;
                    }
                });
            }

            if (
                switchLang !== currentLang &&
                (values[2].questions?.[switchLang]?.length !== 0 ||
                    values[1][switchLang] !== "" ||
                    values[0][switchLang] !== undefined)
            ) {
                setValue(
                    "currentLang",
                    langTabs.find(lang => lang.value === switchLang)!
                );
                clearErrors();
            }
        }
    }, [
        clearErrors,
        errors,
        isSubmitted,
        isSubmitting,
        isValid,
        setValue,
        values
    ]);

    useEffect(() => {
        if (isCreating) {
            setEditing(true);
        }
    }, [isCreating, setEditing]);

    useEffect(() => {
        !isCreating && loadArticle(id);
    }, [isCreating, loadArticle, id]);

    useEffect(() => {
        return () => clear();
    }, [clear]);

    useEffect(() => {
        if (article) {
            if (selectedLang) {
                reset(transformArticles(article, selectedLang));
            } else {
                reset(transformArticles(article));
            }
        }
    }, [reset, article, selectedLang]);

    const onSubmit = async (values: ArticlePayload) => {
        let coverId: LangMap = {};

        try {
            for (const info of langTabs) {
                const langName: Languages = info.value;
                const file = values?.cover[langName];
                if (file instanceof File) {
                    const { _id } = await uploadFile(file);
                    coverId[langName] = _id;
                }
                const blockArray = values?.blocks[langName];
                if (blockArray) {
                    for (let item of blockArray) {
                        if (
                            item.imageId instanceof File &&
                            item.type === "image"
                        ) {
                            const { _id } = await uploadFile(item.imageId);
                            item.imageId = _id;
                        }
                    }
                }
            }
            const formData = getDirtyFields(values, dirtyFields);

            const updatedArticle = await updateOrCreateArticle(
                transformPayload({
                    ...formData,
                    blocks: values.blocks,
                    coverId
                })
            );

            isCreating
                ? throwSuccessToast(
                      t("articles.articleSaved"),
                      t("changesSavedSuccessfully")
                  )
                : throwSuccessToast(
                      t("changesSaved"),
                      t("changesSavedSuccessfully")
                  );
            isCreating && history.push(`/article/${updatedArticle._id}`);
            isCreating ? setSelectedLang(null) : setSelectedLang(values?.currentLang?.value);
            setEditing(false);
        } catch {
            throwErrorToast(t("error"), t("unknownError"));
        }
    };

    if (!article && !isCreating) {
        return <PageSpinner />;
    }

    return (
        <>
            <FormProvider {...formMethods}>
                <form className="px-50p" onSubmit={handleSubmit(onSubmit)}>
                    <DetailsHeader isCreating={!!isCreating} />
                    <section className="w-720p grid grid-cols-1 gap-y-40p">
                        <ManufacturerSection />
                        <MainSection />
                        <BlockSection isEditing={isEditing} />
                        <QuizSection isEditing={isEditing} className="mt-10p" />
                    </section>
                </form>
            </FormProvider>
        </>
    );
});
