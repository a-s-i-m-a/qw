import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useMemo } from "react";
import { renderRoutes, RouteConfigComponentProps } from "react-router-config";
import { useParams } from "react-router-dom";
import { PageSpinner } from "../../../ui/atoms/PageSpinner";
import { giftsStore } from "../store/GiftsStore";

export const GiftWrapper: FC<RouteConfigComponentProps> = observer(
    ({ route }) => {
        const { id } = useParams<Record<"id", string>>();
        const { loadGift, clear, gift } = useContext(giftsStore);

        useEffect(() => {
            if (id) {
                loadGift(id);
            }
            return () => clear();
        }, [id, loadGift, clear]);

        return useMemo(
            () => (
                <section className="flex flex-col flex-1">
                    {!gift || !route ? (
                        <PageSpinner />
                    ) : (
                        renderRoutes(route.routes)
                    )}
                </section>
            ),
            [gift, route]
        );
    }
);
