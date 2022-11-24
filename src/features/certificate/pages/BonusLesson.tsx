import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { PageSpinner } from "../../../ui/atoms/PageSpinner";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { BonusLesson } from "../../types";
import { CertificatesAPI } from "../../utils/api/requests/certificates-requests";
import { uploadFile } from "../../utils/api/requests/file-requests";
import { getDirtyFields } from "../../utils/getDirtyFields";
import { getBonusLessonSchema } from "../../utils/schemas/CertificatesSchema";
import { certificatesStore } from "../store/CertificatesStore";
import { BonusLessonHeader } from "../ui/molecules/BonusLessonHeader";
import { VideoSection } from "../ui/organisms/VideoSection";
import { reorderBonusLessons } from "../utils/reorderBonusLessons";
import { transformBonusLesson } from "../utils/transform";

export const BonusLessonDetails = observer(() => {
    const { t } = useTranslation();
    const {
        isEditing,
        setEditing,
        lesson,
        level,
        bonusLesson,
        loadBonusLesson,
        setTab
    } = useContext(certificatesStore);
    const [isLoading, setLoading] = useState(false);
    const { pathname } = useLocation();
    const history = useHistory();
    const isMatched = useRouteMatch(`/certificates/level/:id/create`)
    const isCreating = !!isMatched
    const { id } = useParams<Record<"id", string>>();
    const levelId = pathname.split("/")[3];
    const formMethods = useForm<BonusLesson>({
        mode: "onSubmit",
        reValidateMode: "onChange",
        resolver: joiResolver(getBonusLessonSchema(t)),
        defaultValues: {
            name: ""
        }
    });
    const { handleSubmit, reset, formState } = formMethods;
    const { dirtyFields } = formState;

    useEffect(() => {
        !isCreating && loadBonusLesson(levelId, id);
    }, [isCreating, levelId, loadBonusLesson, id]);

    useEffect(() => {
        if (bonusLesson && !isCreating) {
            reset({
                ...bonusLesson,
                sortNumber: level?.bonusLessons 
                    ? level?.bonusLessons?.findIndex(item => item._id === id) + 1
                    : undefined
            });
        } else {
            reset({
                name: "",
                sortNumber: level?.bonusLessons?.length
                    ? level?.bonusLessons?.length + 1
                    : 1
            });
        }
    }, [
        reset,
        lesson,
        level?.bonusLessons?.length,
        bonusLesson,
        isCreating,
        level?.bonusLessons,
        id
    ]);

    const onSubmit = async (values: BonusLesson) => {
        try {
            setLoading(true);
            let videoId = values.videoId || undefined;
            if (values?.video instanceof File) {
                const { _id } = await uploadFile(values?.video);
                videoId = _id;
            } else {
                videoId = values?.video?._id;
            }
            const bonusLesson = getDirtyFields(values, dirtyFields);

            const bonusLessonsToUpdate = level?.bonusLessons && reorderBonusLessons({
                bonusLessons: level?.bonusLessons,
                newBonusLesson: bonusLesson,
                isCreating: !!isCreating,
                name: values?.name,
                videoId,
                id
            })

            const formData = {
                sortNumber: level?.sortNumber,
                bonusLessons: transformBonusLesson(bonusLessonsToUpdate)
            };

            const updatedLevel = await CertificatesAPI.updateLevel({
                id: levelId,
                formData
            });
            setTab(1);
            if (isCreating) {
                history.push(`/certificates/level/${updatedLevel?._id}`);
                throwSuccessToast(t("certificate.bonusVideoCreated"));
            } else {
                throwSuccessToast(t("changesSaved"));
            }
            setEditing(false);
        } catch (e) {
            throwErrorToast(t("error"), t("unknownError"));
            setEditing(true);
        }
        setLoading(false);
    };
    if ((!bonusLesson && !isCreating) || isLoading) {
        return <PageSpinner />;
    }
    return (
        <FormProvider {...formMethods}>
            <form
                className="px-50p flex-1 flex flex-col"
                onSubmit={handleSubmit(onSubmit)}
            >
                <BonusLessonHeader isCreating={isCreating} />
                <section className="w-720p grid grid-cols-1 gap-y-40p">
                    <VideoSection isLoading={isLoading} isEditing={isEditing} />
                </section>
            </form>
        </FormProvider>
    );
});
