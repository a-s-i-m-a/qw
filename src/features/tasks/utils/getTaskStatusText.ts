import { TFunction } from "i18next";
import { StatusProps } from "../../catalogue/ui/atoms/Status";
import { ExpertTask, ExpertTaskStatuses } from "../../types";

const texts: Record<ExpertTaskStatuses, StatusProps["text"]> = {
    pending: "inWork",
    accepted: "finished",
    completed: "waitingForReview"
};
export const getTaskStatusText = (
    task: ExpertTask,
    t: TFunction
): StatusProps["status"] => {
    return t(`${texts[task.status]}`);
};
