import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router";
import { PageSpinner } from "../../../ui/atoms/PageSpinner";
import { SectionHeader } from "../../../ui/atoms/SectionHeader";
import { Quiz } from "../../../ui/organisms/Quiz";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { Languages, Lesson } from "../../types";
import { uploadFile } from "../../utils/api/requests/file-requests";
import { getDirtyFields } from "../../utils/getDirtyFields";
import { getLessonSchema } from "../../utils/schemas/CertificatesSchema";
import { certificatesStore } from "../store/CertificatesStore";
import { LessonHeader } from "../ui/molecules/LessonHeader";
import { VideoSection } from "../ui/organisms/VideoSection";
import { getCorrectAnswers } from "../utils/getCorretAnswers";
import { transformLesson } from "../utils/transform";

export const LessonDetails = observer(() => {
    const { t } = useTranslation();
    const {
        isEditing,
        updateOrCreateLesson,
        setEditing,
        loadLesson,
        currentBlock,
        lesson,
        clearLesson,
        level
    } = useContext(certificatesStore);
    const [isLoading, setLoading] = useState(false);
    const { pathname } = useLocation();
    const isCreating = pathname.endsWith("/create");
    const { id } = useParams<Record<"id", string>>();
    const history = useHistory();
    const formMethods = useForm<Lesson>({
        mode: "onSubmit",
        resolver: joiResolver(getLessonSchema(t)),
        defaultValues: {
            name: "",
            quiz: {
                questions: {
                    default: [],
                }
            }
        }
    });
    const { handleSubmit, reset, formState } = formMethods;
    const { dirtyFields } = formState;

    useEffect(() => {
        !isCreating && loadLesson(id);
    }, [isCreating, loadLesson, id]);

    useEffect(() => {
        if (lesson) {
            reset(transformLesson({
                ...lesson,
                sortNumber: lesson?.sortNumber + 1
            }));
        } else {
            reset({
                name: "",
                sortNumber: currentBlock?.lessons?.length
                    ? currentBlock?.lessons?.length + 1
                    : 1
            });
        }
    }, [reset, lesson, currentBlock?.lessons]);

    useEffect(() => {
        return () => {
            clearLesson();
        };
    }, [clearLesson, setEditing]);

    const onSubmit = async (values: Lesson) => {
        try {
            setLoading(true);
            let videoId = values.videoId || undefined;
            if (values?.video instanceof File) {
                const { _id } = await uploadFile(values?.video);
                setLoading(false);
                videoId = _id;
            }
            const formData = {
                ...getDirtyFields(values, dirtyFields),
                sortNumber: values?.sortNumber - 1
            };
            getCorrectAnswers(values.quiz);
            await updateOrCreateLesson({
                ...formData,
                certificateBlockId: id,
                videoId
            });
            if (isCreating) {
                history.replace(`/certificates/level/${level?._id}`)
                throwSuccessToast(t("certificate.videoAdded"));
            } else {
                throwSuccessToast(t("changesSaved"));
            }
        } catch {
            throwErrorToast(t("error"), t("unknownError"));
        }
        setLoading(false);
        setEditing(false);
    };

    if (isLoading || (!lesson && !isCreating)) {
        return <PageSpinner />;
    }
    return (
        <FormProvider {...formMethods}>
            <form
                className="px-50p flex-1 flex flex-col"
                onSubmit={handleSubmit(onSubmit)}
            >
                <LessonHeader isCreating={isCreating} />
                <section className="w-720p grid grid-cols-1 gap-y-40p">
                    <VideoSection isLoading={isLoading} isEditing={isEditing} />
                    <SectionHeader title={t("quiz")} />
                    <Quiz
                        name="quiz"
                        isEditing={isEditing}
                        lang={"default" as Languages}
                    />
                </section>
            </form>
        </FormProvider>
    );
});
