import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ToastClose } from "../../../../ui/atoms/Icon";
import { tasksStore } from "../../store/TasksStore";

export const TaskRejectReason = observer(() => {
    const { task } = useContext(tasksStore);
    const { t } = useTranslation();
    if (!task?.reason) {
        return null;
    }
    return (
        <section className="pr-26p pl-16 py-5 text-14 relative bg-danger rounded-20p truncate text-white">
            <div className="absolute top-0 bottom-0 flex items-center pl-26p left-0">
                <ToastClose />
            </div>
            <h4 className="font-semibold">{t("rejectReason")}</h4>
            <span className="inline-block leading-5 pt-2 whitespace-pre-wrap">
                {task!.reason}
            </span>
        </section>
    );
});
