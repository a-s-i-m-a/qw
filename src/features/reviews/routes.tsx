import { RoledRouteProps } from "../../routes";
import { Details } from "./pages/Details";

export const reviewRoutes: RoledRouteProps[] = [
    {
        path: "/reviews/create",
        component: Details,
        exact: true
    },
    {
        path: "/reviews/:reviewId",
        component: Details,
        exact: true
    }
];
