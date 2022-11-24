import { RoledRouteProps } from "../../routes";
import { Main } from "./pages/Main";
import { Details } from "./pages/Details";
import { RIGHTS } from "../../rights";

export const ROUTE_LINK_GIFT_ORDERS = "/gift-orders";

export const giftOrdersRoutes: RoledRouteProps[] = [
    {
        path: ROUTE_LINK_GIFT_ORDERS,
        component: Main,
        exact: true,
        role: RIGHTS.orders
    },
    {
        path: `${ROUTE_LINK_GIFT_ORDERS}/:id`,
        component: Details,
        exact: true,
        role: RIGHTS.orders
    }
];
