import { createContext } from "react";
import { makeAutoObservable } from "mobx";
import { Role, User } from "../../types";

import { UserAPI } from "../../utils/api/requests/user-requests";
import { MeAPI } from "../../utils/api/requests/me-requests";
import { AuthStoreInstance } from "../../auth/store/AuthStore";
import { transformPayload } from "../utils/transformUser";
import { UserPayload } from "../types";

class UserStore {
    constructor() {
        makeAutoObservable(this);
    }

    user: User | null = null;
    isUserEditing: boolean = false;
    isMe: boolean = false;

    search: string = "";
    activeTab = 0;
    shouldClearSearch: boolean = true;
    orderTab = 0;

    disableUserEditing = () => (this.isUserEditing = false);
    enableUserEditing = () => (this.isUserEditing = true);
    setMe = (value: boolean) => (this.isMe = value);

    clear = () => {
        this.isUserEditing = false;
        this.isMe = false;
        this.user = null;
    };

    loadUser = async (id?: string) => {
        this.user = id ? await UserAPI.getUser(id) : await MeAPI.getProfile();
    };
    updateOrCreateUser = async (values: UserPayload) => {
        const formData = transformPayload({ ...values, _id: this.user?._id });

        let fn = UserAPI.createUser;

        if (this.user?._id) {
            fn = UserAPI.updateUser;
        }
        if (this.user?._id && this.user._id === AuthStoreInstance.user?._id) {
            fn = MeAPI.updateProfile;
        }
        const user = await fn(formData);
        this.user = user;
        return user;
    };

    createUser(user: Partial<User>) {
        return UserAPI.createUser(user);
    }

    unblockUser = async ({ id }: { id: string }) => {
        UserAPI.unblockUser({ id }).then(() => {
            this.user = { ...this.user!, isBlocked: false };
        });
    };

    async updateProfilePassword(user: Partial<User>) {
        const { oldPassword, password } = user;
        return MeAPI.updateProfilePassword({ oldPassword, password });
    }
    setUser = (user: User) => {
        this.user = user;
    };
    setRole = (role: Role) => {
        this.user = this.user ? { ...this.user, role } : ({ role } as User);
    };
    handleSearch = (value: string) => {
        this.search = value;
    };
    setTab = (value: number) => {
        this.activeTab = value;
    };
    setOrderTab = (value: number) => {
        this.orderTab = value;
    };

    setShouldClearSearch = (flag: boolean) => {
        this.shouldClearSearch = flag;
    }

    clearPagination = () => {
        this.activeTab = 0;
        if (this.shouldClearSearch) {
            this.search = "";
            this.orderTab = 0;
        }
    };
}

export const userStore = createContext(new UserStore());
