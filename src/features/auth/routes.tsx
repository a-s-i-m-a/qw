import { Redirect } from "react-router-dom";
import { ForgotPage } from "./pages/Forgot";
import { LoginPage } from "./pages/Login";
import { AuthTemplate } from "./templates/AuthTemplate";
import { renderRoutes, RouteConfig } from "react-router-config";

const routes: RouteConfig[] = [
    {
        path: "/login",
        exact: true,
        component: LoginPage
    },
    {
        path: "/forgot",
        exact: true,
        component: ForgotPage
    },
    {
        path: "/",
        render: () => <Redirect to="/login" />
    }
];

export const AuthRoutes = () => (
    <AuthTemplate>{renderRoutes(routes)}</AuthTemplate>
);
