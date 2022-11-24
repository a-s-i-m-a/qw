import { RIGHTS } from "../../rights";
import { RoledRouteProps } from "../../routes";
import { Main } from "./pages/Main";

export const wineryRoutes: RoledRouteProps[] = [
    {
        path: "/winery",
        component: Main,
        role: RIGHTS.winery,
        exact: true
    }
];
