import { RIGHTS } from "../../rights";
import { RoledRouteProps } from "../../routes";
import { Details } from "./pages/Details";
import { Main } from "./pages/Main";

export const ROUTE_LINK_USERS = "/users";
export const USER_REGEXEP = /^\/(user|me)/;
export const ROUTE_LINK_USER = "/user";
export const ROUTE_LINK_ME = "/me";

export const userRoutes: RoledRouteProps[] = [
    {
        path: ROUTE_LINK_USERS,
        component: Main,
        exact: true,
        role: RIGHTS.users
    },
    {
        path: ROUTE_LINK_ME,
        component: Details,
        exact: true
    },
    {
        path: `${ROUTE_LINK_USER}/create`,
        component: Details,
        exact: true,
        role: RIGHTS.users
    },
    {
        path: `${ROUTE_LINK_USER}/:id`,
        component: Details,
        exact: true,
        role: RIGHTS.users
    }
];
