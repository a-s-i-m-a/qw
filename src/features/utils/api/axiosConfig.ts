import axios from "axios";
import { throwErrorToast } from "../../../ui/organisms/Toaster";
import { AuthStoreInstance } from "../../auth/store/AuthStore";
import { translator } from "../i18n";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

instance.interceptors.request.use(config => {
    const token = AuthStoreInstance.sessionId;

    if (token) {
        config.headers["X-Session-Id"] = token;
        config.headers["x-locale"] = localStorage.getItem("i18nextLng") || "en";
    }
    if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
    }
    return config;
});

instance.interceptors.response.use(
    request => request,
    error => {
        if (error.response || axios.isCancel(error)) {
            if (error.response?.status === 403) {
                AuthStoreInstance.logout();
            }
        } else {
            translator.then(function (t) {
                throwErrorToast(t("error"), t("networkError"));
            });
        }
        return Promise.reject(error);
    }
);

export const get = instance.get;
export const post = instance.post;
export const put = instance.put;
export const remove = instance.delete;
