import { RIGHTS } from "../../rights";
import { RoledRouteProps } from "../../routes";
import { Main } from "./pages/Main";

export const directoryRoutes: RoledRouteProps[] = [
    {
        path: "/directory",
        component: Main,
        exact: true,
        role: RIGHTS.directory
    }
];
