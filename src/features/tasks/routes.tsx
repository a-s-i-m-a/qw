import { RIGHTS } from "../../rights";
import { RoledRouteProps } from "../../routes";
import { Main } from "./pages/Main";
import { TasksController } from "./pages/TasksController";

export const ROUTE_LINK_TASKS = "/tasks";
export const TASK_REGEXEP = /^\/(task)/;
export const ROUTE_LINK_TASK = "/task";

export const tasksRoutes: RoledRouteProps[] = [
    {
        path: ROUTE_LINK_TASKS,
        exact: true,
        role: RIGHTS.tasks,
        component: Main
    },
    {
        path: `${ROUTE_LINK_TASK}/:id`,
        component: TasksController,
        role: RIGHTS.tasks
    }
];
