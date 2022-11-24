import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { PageHeader } from "../../../../ui/molecules/PageHeader";
import { authStore } from "../../../auth/store/AuthStore";
import { Status } from "../../../catalogue/ui/atoms/Status";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { tasksStore } from "../../store/TasksStore";
import { getTaskStatus } from "../../utils/getTaskStatus";
import { getTaskStatusText } from "../../utils/getTaskStatusText";
import { REJECT_TASK_MODAL } from "../modals/RejectTask";
import { PoppedEditButton } from "../molecules/PoppedEditButton";

export const DetailsHeader = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const { task, setEditing } = useContext(tasksStore);
    const { openModal } = useContext(modalPageStore);
    const { user } = useContext(authStore);

    const goToTable = () => {
        history.goBack();
    };

    const setEditMode = () => {
        setEditing(true);
    };
    const onDecline = () => {
        openModal(REJECT_TASK_MODAL);
    };
    return (
        <PageHeader
            afterTitle={
                task?._id && (
                    <Status
                        status={getTaskStatus(task)}
                        className="ml-5"
                        text={getTaskStatusText(task, t)}
                    />
                )
            }
            onBack={goToTable}
            title={task?.product?.name ?? "—"}
        >
            <>
                {user!.role === "expert" && task?.status === "pending" && (
                    <Button
                        text={t("sendToReview")}
                        // isDisabled={!isDirty || !isValid}
                    />
                )}
                {user!.role !== "expert" && (
                    <>
                        {task?.status === "completed" && (
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
                        <PoppedEditButton />
                    </>
                )}
            </>
        </PageHeader>
    );
};
