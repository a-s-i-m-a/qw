import { observer } from "mobx-react-lite";
import { FC, useContext, lazy } from "react";

import { authStore } from "./features/auth/store/AuthStore";
import { retry } from "./features/utils/retry";
import { OverlayLoader } from "./ui/atoms/OverlayLoader";

const AuthRoutes = lazy(() =>
    retry(() =>
        import("./features/auth/routes").then(module => ({
            default: module.AuthRoutes
        }))
    )
);
const AppRoutes = lazy(() =>
    retry(() =>
        import("./routes").then(module => ({
            default: module.AppRoutes
        }))
    )
);

export const App: FC = observer(() => {
    const auth = useContext(authStore);
    if (auth.sessionId === null) {
        return <AuthRoutes />;
    }
    if (!auth.user) {
        return <OverlayLoader />;
    }
    if (auth.user && auth.user.role === "user") {
        auth.logout();
    }
    return <AppRoutes />;
});
