import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { joiResolver } from "@hookform/resolvers/joi";
import { useContext, useEffect } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";

import { PageSpinner } from "../../../ui/atoms/PageSpinner";
import { reviewStore } from "../store/ReviewStore";
import { DetailsHeader } from "../ui/molecules/DetailsHeader";
import { UserSection } from "../ui/organisms/UserSection";
import { ReviewExpertPayload } from "../types";
import { WineSection } from "../ui/organisms/WineSection";
import { CharacteristicSection } from "../ui/organisms/CharacteristicSection";
import { AromaSection } from "../ui/organisms/AromaSection";
import { AfterTasteSection } from "../ui/organisms/AfterTasteSection";
import { RatingSection } from "../ui/organisms/RatingSection";
import { WineDescriptionSection } from "../ui/organisms/WineDescriptionSection";
import { getAdminReviewSchema } from "../../utils/schemas/ReviewSchema";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { Languages } from "../../types";
import { langTabs } from "../../../ui/organisms/LanguageTabChanger";
import { transformReview } from "../utils/transformReview";
import { authStore } from "../../auth/store/AuthStore";

export const Details = observer(() => {
    const { reviewId } = useParams<Record<"reviewId", string>>();
    const { t } = useTranslation();
    const history = useHistory();
    const isCreating = useRouteMatch("/reviews/create");
    const { user } = useContext(authStore);
    const {
        loadReview,
        setEditing,
        review,
        isEditing,
        clear,
        updateOrCreateReview
    } = useContext(reviewStore);

    const formMethods = useForm<ReviewExpertPayload>({
        mode: "onChange",
        defaultValues: {
            lang: langTabs.find(lang => lang.value === "en")
        },
        resolver: joiResolver(getAdminReviewSchema(t))
    });

    const {
        handleSubmit,
        reset,
        formState,
        setValue,
        clearErrors
    } = formMethods;
    const { errors, isSubmitted, isValid } = formState;

    const values = formMethods.watch([
        "expertText",
        "expertAftertasteDescription",
        "lang"
    ]);

    useEffect(() => {
        //tab switcher
        if (isSubmitted && !isValid) {
            const currentLang = values[2].value;
            const wineDescrError = errors?.["expertText"] ?? {};
            const tasteDescrError =
                errors?.["expertAftertasteDescription"] ?? {};
            const descrErrorLangs = Object.keys(wineDescrError) as Languages[];
            const tasteErrorLangs = Object.keys(tasteDescrError) as Languages[];

            let switchLang = currentLang as Languages;

            if (!descrErrorLangs.includes(currentLang)) {
                descrErrorLangs.forEach(lang => {
                    if (lang !== currentLang) {
                        switchLang = lang;
                    }
                });
            }
            if (!tasteErrorLangs.includes(currentLang)) {
                tasteErrorLangs.forEach(lang => {
                    if (lang !== currentLang) {
                        switchLang = lang;
                    }
                });
            }

            if (
                switchLang !== currentLang &&
                (values[1][switchLang] !== "" || values[0][switchLang] !== "")
            ) {
                setValue(
                    "lang",
                    langTabs.find(lang => lang.value === switchLang)!
                );
                clearErrors(`expertAftertasteDescription.${switchLang}`);
                clearErrors(`expertText.${switchLang}`);
            }
        }
    }, [clearErrors, errors, isSubmitted, isValid, setValue, values]);

    useEffect(() => {
        if (isCreating) {
            setEditing(true);
        }
    }, [isCreating, setEditing]);

    useEffect(() => {
        !isCreating && loadReview(reviewId);
    }, [isCreating, loadReview, reviewId]);
    useEffect(() => {
        return () => clear();
    }, [clear]);

    useEffect(() => {
        review && reset(transformReview(review, review.user));
    }, [reset, review]);

    const onSubmit = async (values: ReviewExpertPayload) => {
        try {
            const updatedUser = await updateOrCreateReview(values);
            throwSuccessToast(t("changesSaved"), t("changesSavedSuccessfully"));
            isCreating && history.push(`/reviews/${updatedUser._id}`);
            setEditing(false);
        } catch {
            throwErrorToast(t("error"), t("unknownError"));
        }
    };

    if (!review && !isCreating) {
        return <PageSpinner />;
    }

    return (
        <FormProvider {...formMethods}>
            <form className="px-50p" onSubmit={handleSubmit(onSubmit)}>
                <DetailsHeader isCreating={!!isCreating} />
                <section className="w-720p grid grid-cols-1 gap-y-50p">
                    {user?.role !== "manufacturer" && <UserSection />}
                    {isEditing && <WineSection isEditing={isEditing} />}
                    <CharacteristicSection isEditing={isEditing} />
                    <AromaSection isEditing={isEditing} />
                    <AfterTasteSection isEditing={isEditing} />
                    <RatingSection isEditing={isEditing} />
                    <WineDescriptionSection isEditing={isEditing} />
                </section>
            </form>
        </FormProvider>
    );
});
