import { RIGHTS } from "../../rights";
import { RoledRouteProps } from "../../routes";
import { Main } from "./pages/Main";

export const statsRoutes: RoledRouteProps[] = [
    {
        path: "/stat",
        component: Main,
        role: RIGHTS.stats,
        exact: true
    }
];
