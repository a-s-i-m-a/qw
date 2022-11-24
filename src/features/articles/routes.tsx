import { RoledRouteProps } from "../../routes";
import { Details } from "./pages/Details";

export const articlesRoutes: RoledRouteProps[] = [
    {
        path: "/article/create",
        component: Details,
        exact: true
    },
    {
        path: "/article/:id",
        component: Details,
        exact: true
    }
];
