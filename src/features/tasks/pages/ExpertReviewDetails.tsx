import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InfoSection } from "../../promotion/ui/organisms/InfoSection";
import { Languages } from "../../types";
import { tasksStore } from "../store/TasksStore";
import { TaskRejectReason } from "../ui/molecules/TaskRejectReason";
import { DetailsHeader } from "../ui/organisms/DetailsHeader";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { ReviewExpertPayload } from "../../reviews/types";
import { getExpertReviewSchema } from "../../utils/schemas/ReviewSchema";
import { AromaSection } from "../../reviews/ui/organisms/AromaSection";
import { CharacteristicSection } from "../../reviews/ui/organisms/CharacteristicSection";
import { RatingSection } from "../../reviews/ui/organisms/RatingSection";
import { AfterTasteSection } from "../ui/molecules/AfterTasteSection";
import { WineDescriptionSection } from "../ui/molecules/WineDescriptionSection";
import {
    languageOptions,
    LanguageSelectionSection
} from "../ui/molecules/LanguageSelectionSection";
import {
    transformReview,
    transformReviewPayload
} from "../../reviews/utils/transformReview";

export const ExpertReviewDetails = observer(() => {
    const { task, setEditing, completeTaskByExpert, isEditing } = useContext(
        tasksStore
    );
    const { t, i18n } = useTranslation();
    const formMethods = useForm<ReviewExpertPayload>({
        mode: "onChange",
        defaultValues: {
            lang: languageOptions.find(
                lang => lang.value === ((i18n.language as Languages) ?? "en")
            )
        },
        resolver: joiResolver(getExpertReviewSchema(t))
    });

    const { reset, handleSubmit } = formMethods;

    useEffect(() => {
        task?.review && reset(transformReview(task.review, task.expert));
    }, [reset, task]);
    console.log(formMethods.formState.errors, formMethods.watch());

    useEffect(() => {
        if (task?.status === "pending") {
            setEditing(true);
        }
        return () => {
            setEditing(false);
        };
    }, [setEditing, task]);

    const onSubmit = async (values: ReviewExpertPayload) => {
        try {
            await completeTaskByExpert({
                review: transformReviewPayload(values)
            });
            throwSuccessToast(
                t("taskWasSentToReview"),
                t("waitForModeratorReview")
            );
            setEditing(false);
        } catch (event) {
            throwErrorToast(t("error"), t("unknownError"));
        }
    };
    const values = formMethods.watch(["text", "aftertasteDescription", "lang"]);
    useEffect(() => {
        // remove all languages except main
        values[0] &&
            Object.entries(values[0]).forEach(linkWithLang => {
                const [lang] = linkWithLang;

                if (lang === values[2].value) {
                    return;
                }

                formMethods.unregister(`text`, {
                    keepError: true
                });
            });
        values[1] &&
            Object.entries(values[1]).forEach(linkWithLang => {
                const [lang] = linkWithLang;

                if (lang === values[2].value) {
                    return;
                }

                formMethods.unregister(`aftertasteDescription`, {
                    keepError: true
                });
            });
    }, [formMethods, values]);
    return (
        <FormProvider {...formMethods}>
            <form className="px-50p" onSubmit={handleSubmit(onSubmit)}>
                <DetailsHeader />
                <section className="w-720p grid gap-y-50p">
                    <InfoSection product={task!.product} role="expert" />
                    <TaskRejectReason />
                    <LanguageSelectionSection isEditing={isEditing} />
                    <WineDescriptionSection isEditing={isEditing} />
                    <CharacteristicSection isEditing={isEditing} />
                    <AromaSection isEditing={isEditing} />
                    <AfterTasteSection isEditing={isEditing} />
                    <RatingSection isEditing={isEditing} />
                </section>
            </form>
        </FormProvider>
    );
});
