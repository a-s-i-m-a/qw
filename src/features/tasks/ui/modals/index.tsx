import { DeleteTask, DELETE_TASK_MODAL } from "./DeleteTask";
import { REJECT_TASK_MODAL, RejectTaskModal } from "./RejectTask";

export const TasksModals = () => {
    return (
        <>
            <RejectTaskModal id={REJECT_TASK_MODAL} />
            <DeleteTask id={DELETE_TASK_MODAL} />
        </>
    );
};
