import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { renderRoutes, RouteConfig } from "react-router-config";

import { authStore } from "./features/auth/store/AuthStore";
import {
    catalogueRoutes,
    ROUTE_LINK_CATALOGUE
} from "./features/catalogue/routes";
import { Role } from "./features/types";
import { MainTemplate } from "./ui/templates/MainTemplate";
import { ROUTE_LINK_USERS, userRoutes } from "./features/user/routes";
import { directoryRoutes } from "./features/directory/routes";
import { promotionRoutes } from "./features/promotion/routes";
import { videoRoutes } from "./features/videos/routes";
import { reviewRoutes } from "./features/reviews/routes";
import { ROUTE_LINK_TASKS, tasksRoutes } from "./features/tasks/routes";
import { giftsRoutes } from "./features/gifts/routes";
import { articlesRoutes } from "./features/articles/routes";
import { wineryRoutes } from "./features/winery/routes";
import { useMemo } from "react";
import {
    discountsRoutes,
    ROUTE_LINK_DISCOUNTS
} from "./features/discounts/routes";
import { salepointsRoutes } from "./features/salepoints/routes";
import { ordersRoutes } from "./features/orders/routes";
import { certificateRoutes } from "./features/certificate/routes";
import { statsRoutes } from "./features/stats/routes";
import { giftOrdersRoutes } from "./features/giftOrders/routes";

export interface RoledRouteProps extends RouteConfig {
    role?: Role[];
}

const defaultPages: Record<string, string> = {
    owner: ROUTE_LINK_USERS,
    admin: ROUTE_LINK_USERS,
    moderator: ROUTE_LINK_CATALOGUE,
    expert: ROUTE_LINK_TASKS,
    manufacturer: ROUTE_LINK_CATALOGUE,
    retailer: ROUTE_LINK_DISCOUNTS
};

const routes: RoledRouteProps[] = [
    ...tasksRoutes,
    ...videoRoutes,
    ...reviewRoutes,
    ...promotionRoutes,
    ...directoryRoutes,
    ...catalogueRoutes,
    ...userRoutes,
    ...giftsRoutes,
    ...articlesRoutes,
    ...wineryRoutes,
    ...discountsRoutes,
    ...salepointsRoutes,
    ...ordersRoutes,
    ...certificateRoutes,
    ...statsRoutes,
    ...giftOrdersRoutes
];

export const AppRoutes = observer(() => {
    const { user } = useContext(authStore);
    const routesArray = useMemo(
        () =>
            routes.filter(
                route => !route.role || route.role.includes(user!.role)
            ),
        [user]
    );
    return (
        <MainTemplate>
            {renderRoutes([
                ...routesArray,
                {
                    path: "/",
                    render: () => (
                        <Redirect
                            exact
                            from="/"
                            to={defaultPages[user!.role] || "/me"}
                        />
                    )
                }
            ])}
        </MainTemplate>
    );
});
