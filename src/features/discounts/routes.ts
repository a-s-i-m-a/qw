import { RIGHTS } from "../../rights";
import { RoledRouteProps } from "../../routes";

import { Main } from "./pages/Main";
import { Details } from "./pages/Details";

export const ROUTE_LINK_DISCOUNTS = "/discounts";

export const discountsRoutes: RoledRouteProps[] = [
    {
        path: "/discounts",
        exact: true,
        role: RIGHTS.discounts,
        component: Main
    },
    {
        path: "/discounts/create",
        component: Details,
        role: RIGHTS.discounts,
        exact: true
    },
    {
        path: "/discounts/:id",
        component: Details,
        role: RIGHTS.discounts,
        exact: true
    }
];
