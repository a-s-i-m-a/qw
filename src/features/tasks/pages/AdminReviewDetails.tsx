import { joiResolver } from "@hookform/resolvers/joi";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../ui/atoms/Button";
import { PageHeader } from "../../../ui/molecules/PageHeader";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../ui/organisms/Toaster";
import { Status } from "../../catalogue/ui/atoms/Status";
import { modalPageStore } from "../../modalpage/store/ModalPageStore";
import { ReviewExpertPayload } from "../../reviews/types";
import { AfterTasteSection } from "../../reviews/ui/organisms/AfterTasteSection";
import { AromaSection } from "../../reviews/ui/organisms/AromaSection";
import { CharacteristicSection } from "../../reviews/ui/organisms/CharacteristicSection";
import { RatingSection } from "../../reviews/ui/organisms/RatingSection";
import { WineDescriptionSection } from "../../reviews/ui/organisms/WineDescriptionSection";
import { getDetailsTitle } from "../../reviews/utils/getDetailsTitle";
import {
    transformReview,
    transformReviewPayload
} from "../../reviews/utils/transformReview";
import { Languages } from "../../types";
import { getExpertReviewSchema } from "../../utils/schemas/ReviewSchema";
import { UserDetails } from "../../videos/ui/organisms/UserDetails";
import { tasksStore } from "../store/TasksStore";
import { REJECT_TASK_MODAL } from "../ui/modals/RejectTask";
import { languageOptions } from "../ui/molecules/LanguageSelectionSection";
import { TaskRejectReason } from "../ui/molecules/TaskRejectReason";
import { TaskShortInfo } from "../ui/molecules/TaskShortInfo";
import { getTaskStatus } from "../utils/getTaskStatus";
import { getTaskStatusText } from "../utils/getTaskStatusText";
import { WineDescriptionSection as ViewWineDescriptionSection } from "../ui/molecules/WineDescriptionSection";
import { AfterTasteSection as ViewAfterTasteSection } from "../ui/molecules/AfterTasteSection";
import { PoppedEditButton } from "../ui/molecules/PoppedEditButton";
import { WineSection } from "../../reviews/ui/organisms/WineSection";

export const AdminReviewDetails = observer(() => {
    const { task, setEditing, acceptTask, isEditing } = useContext(tasksStore);
    const { t, i18n } = useTranslation();
    const { openModal } = useContext(modalPageStore);

    const formMethods = useForm<ReviewExpertPayload>({
        mode: "onChange",
        resolver: joiResolver(getExpertReviewSchema(t)),
        defaultValues: {
            lang: languageOptions.find(
                lang => lang.value === ((i18n.language as Languages) ?? "en")
            ),
            productId: {
                label: task?.product?.name,
                value: task?.product?._id
            }
        }
    });
    const { reset, handleSubmit } = formMethods;

    useEffect(() => {
        task?.review && reset(transformReview(task.review, task.expert, true));
    }, [task, reset]);
    const onSubmit = async (values: ReviewExpertPayload) => {
        try {
            await acceptTask({ review: transformReviewPayload(values) });

            throwSuccessToast(t("reviewWasSaved"), t("expertReviewWasUpdated"));
            setEditing(false);
        } catch {
            throwErrorToast(t("error"), t("unknownError"));
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
            <form
                className="px-50p"
                onSubmit={isEditing ? handleSubmit(onSubmit) : undefined}
            >
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
                            <WineSection isEditing={true} isDisabled={true} />
                            <CharacteristicSection isEditing={true} />
                            <AromaSection isEditing={true} />
                            <AfterTasteSection isEditing={true} />
                            <RatingSection isEditing={true} />
                            <WineDescriptionSection isEditing={true} />
                        </>
                    ) : (
                        <>
                            <TaskShortInfo />
                            <TaskRejectReason />
                            <ViewWineDescriptionSection isEditing={false} />
                            <CharacteristicSection isEditing={false} />
                            <AromaSection isEditing={false} />
                            <ViewAfterTasteSection isEditing={false} />
                            <RatingSection isEditing={false} />
                        </>
                    )}
                </section>
            </form>
        </FormProvider>
    );
});
