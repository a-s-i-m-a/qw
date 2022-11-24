import { RIGHTS } from "../../rights";
import { RoledRouteProps } from "../../routes";

import { Main } from "./pages/Main";
import { Certificate } from "./pages/Certificate";
import { LevelDetails } from "./pages/LevelDetails";
import { LessonDetails } from "./pages/LessonDatails";
import { BonusLessonDetails } from "./pages/BonusLesson";

export const ROUTE_LINK_CERTIFICATES = "/certificates";

export const certificateRoutes: RoledRouteProps[] = [
    {
        path: "/certificates",
        exact: true,
        role: RIGHTS.certificates,
        component: Main
    },
    {
        path: "/certificates/:id",
        component: Certificate,
        role: RIGHTS.certificates,
        exact: true
    },
    {
        path: "/certificates/:id/:id",
        component: LevelDetails,
        role: RIGHTS.certificates,
        exact: true
    },
    {
        path: "/certificates/level/block/:id/create",
        component: LessonDetails,
        role: RIGHTS.certificates,
        exact: true
    },
    {
        path: "/certificates/level/block/:id/:id",
        component: LessonDetails,
        role: RIGHTS.certificates,
        exact: true
    },
    {
        path: "/certificates/level/:id/create",
        component: BonusLessonDetails,
        role: RIGHTS.certificates,
        exact: true
    },
    {
        path: "/certificates/level/:id/:id",
        component: BonusLessonDetails,
        role: RIGHTS.certificates,
        exact: true
    }
];
