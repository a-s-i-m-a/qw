import { RIGHTS } from "../../rights";
import { RoledRouteProps } from "../../routes";

import { Main } from "./pages/Main";
import { Details } from "./pages/Details";

export const promotionRoutes: RoledRouteProps[] = [
    {
        path: "/promotion",
        exact: true,
        role: RIGHTS.promotion,
        component: Main
    },
    {
        path: "/promotion/create",
        component: Details,
        role: RIGHTS.promotion,
        exact: true
    },
    {
        path: "/promotion/:id",
        component: Details,
        role: RIGHTS.promotion,
        exact: true
    }
];
