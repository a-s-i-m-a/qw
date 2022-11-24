import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { User } from "../../types";
import { AuthAPI } from "../../utils/api/requests/auth-requests";

export class AuthStore {
    sessionId: string | null = null;
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
        this.load();
    }

    load = () => {
        this.sessionId = window.localStorage.getItem("sessionId");
        this.sessionId &&
            AuthAPI.getUserBySessionId().then(({ data }) => {
                this.user = data.result;
            });
    };

    setSessionId = (id: string) => {
        this.sessionId = id;
        window.localStorage.setItem("sessionId", id);
        this.load();
    };

    logout = () => {
        this.sessionId = null;
        this.user = null;
        window.localStorage.removeItem("sessionId");
    };
}

export const AuthStoreInstance = new AuthStore();
export const authStore = createContext(AuthStoreInstance);
