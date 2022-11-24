import { StatusProps } from "../../catalogue/ui/atoms/Status";
import { ExpertTask, ExpertTaskStatuses } from "../../types";

const statuses: Record<ExpertTaskStatuses, StatusProps["status"]> = {
    pending: "purple",
    accepted: "success",
    completed: "neutral"
};
export const getTaskStatus = (task: ExpertTask): StatusProps["status"] => {
    return statuses[task.status];
};

