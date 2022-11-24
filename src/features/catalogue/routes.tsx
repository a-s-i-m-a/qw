import { RoledRouteProps } from "../../routes";
import { Main } from "./pages/Main";
import { Details } from "./pages/Details";
import { ProductWrapper } from "./pages/ProductWrapper";
import { RIGHTS } from "../../rights";

export const ROUTE_LINK_CATALOGUE = "/catalogue";
export const CATALOGUE_REGEXEP = /^\/(catalogue|product)/;
export const ROUTE_LINK_PRODUCT = "/product";

export const catalogueRoutes: RoledRouteProps[] = [
    {
        path: ROUTE_LINK_CATALOGUE,
        component: Main,
        exact: true,
        role: RIGHTS.catalogue
    },
    {
        path: `${ROUTE_LINK_CATALOGUE}/create`,
        component: Details,
        role: RIGHTS.catalogue,
        exact: true
    },
    {
        path: `${ROUTE_LINK_PRODUCT}/:id`,
        component: ProductWrapper,
        role: RIGHTS.catalogue,
        routes: [
            {
                path: `${ROUTE_LINK_PRODUCT}/:id`,
                component: Details,
                exact: true
            }
        ]
    }
];
