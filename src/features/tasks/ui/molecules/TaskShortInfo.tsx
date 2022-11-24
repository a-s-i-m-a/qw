import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { LinkIcon } from "../../../../ui/atoms/Icon";
import { tasksStore } from "../../store/TasksStore";
import validUrl from "valid-url";

export const TaskShortInfo = observer(() => {
    const { task } = useContext(tasksStore);
    const { t } = useTranslation();
    const isValid = validUrl.isUri(task!.videoUrl);

    return (
        <section className="p-30p bg-gray-bg rounded-20p truncate">
            <h3>{`${t("performer")}: ${task?.expert.name}`}</h3>
            {task?.type === "video" &&
                (isValid ? (
                    <a
                        rel="noreferrer"
                        target="_blank"
                        href={task.videoUrl}
                        className="block mt-30p truncate underline"
                    >
                        <LinkIcon className="mr-5 inline-block flex-shrink-0" />
                        {task.videoUrl ?? "-"}
                    </a>
                ) : (
                    <span className="block mt-30p truncate">
                        <LinkIcon className="mr-5 inline-block flex-shrink-0" />
                        {task.videoUrl ?? "-"}
                    </span>
                ))}
        </section>
    );
});
