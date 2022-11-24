import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { FC, useContext, useEffect, useMemo } from "react";
import { RouteConfigComponentProps } from "react-router-config";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { PageSpinner } from "../../../ui/atoms/PageSpinner";
import { authStore } from "../../auth/store/AuthStore";
import { tasksStore } from "../store/TasksStore";
import { ExpertVideoDetails } from "./ExpertVideoDetails";
import { ExpertReviewDetails } from "./ExpertReviewDetails";
import { AdminReviewDetails } from "./AdminReviewDetails";
import { VideoAdminDetails } from "./VideoAdminDetails";

export const TasksController: FC<RouteConfigComponentProps> = observer(
    ({ route }) => {
        const { id } = useParams<Record<"id", string>>();
        const history = useHistory();
        const location = useLocation<Record<string, number> | null>();
        const { load, clear, isError, task } = useContext(tasksStore);
        const { user } = useContext(authStore);

        useEffect(() => {
            load(id);
            return () => clear();
        }, [clear, id, load]);

        useEffect(() => {
            if (isError) {
                history.push("/tasks");
            }
        }, [isError, history, location.state]);

        const TaskDetails = useCallback(() => {
            if (user?.role === "expert") {
                if (task?.type === "video") {
                    return <ExpertVideoDetails />;
                }
                return <ExpertReviewDetails />;
            }
            if (task?.type === "video") {
                return <VideoAdminDetails />;
            }
            return <AdminReviewDetails />;
        }, [task?.type, user?.role]);
        return useMemo(
            () => (
                <section className="flex flex-col flex-1">
                    {!task || !route ? <PageSpinner /> : <TaskDetails />}
                </section>
            ),
            [task, route, TaskDetails]
        );
    }
);
