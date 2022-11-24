import { RoledRouteProps } from "../../routes";
import { Main } from "./pages/Main";
import { Details } from "./pages/Details";
import { RIGHTS } from "../../rights";

export const ROUTE_LINK_SALEPOINTS = "/salepoints";

export const salepointsRoutes: RoledRouteProps[] = [
    {
        path: ROUTE_LINK_SALEPOINTS,
        component: Main,
        exact: true,
        role: RIGHTS.salepoints
    },
    {
        path: `${ROUTE_LINK_SALEPOINTS}/create`,
        component: Details,
        exact: true,
        role: RIGHTS.salepoints
    },
    {
        path: `${ROUTE_LINK_SALEPOINTS}/:id`,
        component: Details,
        exact: true,
        role: RIGHTS.salepoints
    }
];
