import { RoledRouteProps } from "../../routes";
import { Details } from "../videos/pages/Details";

export const videoRoutes: RoledRouteProps[] = [
    {
        path: "/video/create",
        component: Details,
        exact: true
    },
    {
        path: "/video/:videoId",
        component: Details,
        exact: true
    }
];
