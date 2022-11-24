import { RoledRouteProps } from "../../routes";
import { Main } from "./pages/Main";
import { GiftWrapper } from "./pages/GiftWrapper";
import { Details } from "./pages/Details";
import { RIGHTS } from "../../rights";

export const ROUTE_LINK_GIFTS = "/gifts";

export const giftsRoutes: RoledRouteProps[] = [
    {
        path: ROUTE_LINK_GIFTS,
        component: Main,
        exact: true,
        role: RIGHTS.gifts
    },
    {
        path: `${ROUTE_LINK_GIFTS}/create`,
        component: Details,
        exact: true,
        role: RIGHTS.gifts
    },
    {
        path: `${ROUTE_LINK_GIFTS}/:id`,
        component: GiftWrapper,
        role: RIGHTS.catalogue,
        routes: [
            {
                path: `${ROUTE_LINK_GIFTS}/:id`,
                component: Details,
                exact: true
            }
        ]
    }
];