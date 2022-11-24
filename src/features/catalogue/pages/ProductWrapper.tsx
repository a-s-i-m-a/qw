import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useMemo } from "react";
import { renderRoutes, RouteConfigComponentProps } from "react-router-config";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { PageSpinner } from "../../../ui/atoms/PageSpinner";
import { ROUTE_LINK_CATALOGUE } from "../routes";
import { catalogueStore } from "../store/CatalogueStore";

export const ProductWrapper: FC<RouteConfigComponentProps> = observer(
    ({ route }) => {
        const { id } = useParams<Record<"id", string>>();
        const history = useHistory();
        const location = useLocation<Record<string, number> | null>();
        const { load, clear, isError, product } = useContext(catalogueStore);

        useEffect(() => {
            load(id);
            return () => clear();
        }, [clear, id, load]);

        useEffect(() => {
            if (isError) {
                history.push(ROUTE_LINK_CATALOGUE);
            }
        }, [isError, history, location.state]);
        return useMemo(
            () => (
                <section className="flex flex-col flex-1">
                    {!product || !route ? (
                        <PageSpinner />
                    ) : (
                        renderRoutes(route.routes)
                    )}
                </section>
            ),
            [product, route]
        );
    }
);
