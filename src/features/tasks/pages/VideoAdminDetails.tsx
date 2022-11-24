import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { joiResolver } from "@hookform/resolvers/joi";
import { useContext, useEffect } from "react";
import { Languages } from "../../types";

import { getVideoSchema } from "../../utils/schemas/VideoSchema";
import {
    langTabs,
    LanguageTabChanger
} from "../../../ui/organisms/LanguageTabChanger";
import { tasksStore } from "../store/TasksStore";
import { VideoPayload } from "../../videos/types";
import { UserDetails } from "../../videos/ui/organisms/UserDetails";
import { QuizSection } from "../../videos/ui/organisms/QuizSection";
import { VideoDetails } from "../../videos/ui/organisms/VideoDetails";
import { PageHeader } from "../../../ui/molecules/PageHeader";
import { Button } from "../../../ui/atoms/Button";
import { getDetailsTitle } from "../../videos/utils/getDetailsTitle";
import {
    transformVideo,
    transformVideoPayload
} from "../../videos/utils/transformVideo";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { useHistory } from "react-router-dom";
import { modalPageStore } from "../../modalpage/store/ModalPageStore";
import { REJECT_TASK_MODAL } from "../ui/modals/RejectTask";
import { Status } from "../../catalogue/ui/atoms/Status";
import { getTaskStatus } from "../utils/getTaskStatus";
import { getTaskStatusText } from "../utils/getTaskStatusText";
import { TaskShortInfo } from "../ui/molecules/TaskShortInfo";
import { TaskRejectReason } from "../ui/molecules/TaskRejectReason";
import { PoppedEditButton } from "../ui/molecules/PoppedEditButton";
import { WineSelectingSection } from "../../promotion/ui/organisms/WineSelectingSection";

export const VideoAdminDetails = observer(() => {
    const { t, i18n } = useTranslation();
    const { openModal } = useContext(modalPageStore);
    const { setEditing, task, acceptTask, isEditing } = useContext(tasksStore);

    const formMethods = useForm<VideoPayload>({
        mode: "onChange",
        defaultValues: {
            currentLang: langTabs.find(
                lang => lang.value === ((i18n.language as Languages) ?? "en")
            ),
            links: {
                [(i18n.language as Languages) ?? "en"]: task?.videoUrl
            },
            expert: {
                label: task?.expert.name,
                value: task?.expert._id
            },
            productId: { label: task?.product?.name, value: task?.product?._id }
        },
        resolver: joiResolver(getVideoSchema(t))
    });

    const { handleSubmit, reset } = formMethods;

    useEffect(() => {
        task?.video && reset(transformVideo(task.video));
    }, [reset, task?.video]);

    const onSubmit = async (values: VideoPayload) => {
        if (isEditing) {
            try {
                await acceptTask({ video: transformVideoPayload(values) });

                throwSuccessToast(
                    t("videoWasSaved"),
                    t("expertVideoWasUpdated")
                );
                setEditing(false);
            } catch {
                throwErrorToast(t("error"), t("unknownError"));
            }
        }
    };
    const history = useHistory();
    const setEditMode = () => {
        setEditing(true);
    };
    const onDecline = () => {
        openModal(REJECT_TASK_MODAL);
    };

    return (
        <FormProvider {...formMethods}>
            <form className="px-50p" onSubmit={handleSubmit(onSubmit)}>
                <PageHeader
                    afterTitle={
                        task?._id &&
                        !isEditing && (
                            <Status
                                status={getTaskStatus(task)}
                                className="ml-5"
                                text={getTaskStatusText(task, t)}
                            />
                        )
                    }
                    onBack={!isEditing ? history.goBack : undefined}
                    title={getDetailsTitle(
                        task!.product,
                        isEditing,
                        isEditing,
                        t
                    )}
                >
                    {!isEditing && task?.status === "completed" && (
                        <>
                            <Button
                                text={t("decline")}
                                type="secondary-danger"
                                htmlType="button"
                                onClick={onDecline}
                            />
                            <Button
                                onClick={setEditMode}
                                htmlType="button"
                                text={t("accept")}
                            />
                        </>
                    )}
                    {!isEditing && <PoppedEditButton />}
                    {isEditing && (
                        <>
                            <Button
                                text={t("cancel_2")}
                                type="secondary"
                                htmlType="button"
                                onClick={() => setEditing(false)}
                            />
                            <Button text={t("save")} />
                        </>
                    )}
                </PageHeader>
                <section className="w-720p grid gap-y-50p">
                    {isEditing ? (
                        <>
                            <UserDetails isEditing={true} isDisabled={true} />
                            <WineSelectingSection
                                isEditing={true}
                                isDisabled={true}
                            />
                            <LanguageTabChanger name="currentLang" />
                            <VideoDetails isEditing={true} />
                            <QuizSection isEditing={true} />
                        </>
                    ) : (
                        <>
                            <TaskShortInfo />
                            <TaskRejectReason />
                        </>
                    )}
                </section>
            </form>
        </FormProvider>
    );
});
