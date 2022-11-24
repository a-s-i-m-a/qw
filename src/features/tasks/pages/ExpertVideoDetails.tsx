import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { authStore } from "../../auth/store/AuthStore";
import { InfoSection } from "../../promotion/ui/organisms/InfoSection";
import { ExpertTask } from "../../types";
import { getExpertTaskSchema } from "../../utils/schemas/ExpertTaskSchema";
import { tasksStore } from "../store/TasksStore";
import { TaskRejectReason } from "../ui/molecules/TaskRejectReason";
import { DetailsHeader } from "../ui/organisms/DetailsHeader";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { VideoUrlSection } from "../ui/molecules/VideoUrlSection";

export const ExpertVideoDetails = observer(() => {
    const { user } = useContext(authStore);
    const { task, setEditing, completeTaskByExpert, isEditing } = useContext(
        tasksStore
    );
    const { t } = useTranslation();
    const formMethods = useForm<ExpertTask>({
        mode: "onChange",
        resolver: joiResolver(getExpertTaskSchema(t, user!.role))
    });
    const { reset, handleSubmit } = formMethods;

    useEffect(() => {
        task && reset(task);
    }, [task, reset]);

    useEffect(() => {
        if (task?.status === "pending") {
            setEditing(true);
        }
        return () => {
            setEditing(false);
        };
    }, [setEditing, task]);

    const onSubmit = async (values: ExpertTask) => {
        try {
            await completeTaskByExpert({
                videoUrl: values.videoUrl
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

    return (
        <FormProvider {...formMethods}>
            <form className="px-50p" onSubmit={handleSubmit(onSubmit)}>
                <DetailsHeader />
                <section className="w-720p grid gap-y-50p">
                    <InfoSection product={task!.product} role="expert" />
                    <TaskRejectReason />
                    <VideoUrlSection isEditing={isEditing} />
                </section>
            </form>
        </FormProvider>
    );
});
