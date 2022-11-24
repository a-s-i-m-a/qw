import { get, post, remove } from "../axiosConfig";
import { userFields, userSessionID } from "../../../fields/user";
import { LoginResponse } from "../../../auth/types";

export const AuthAPI = {
    async getUserBySessionId(): Promise<any> {
        return get(`/api/v1/me?_fields=${userFields}`);
    },
    async logoutSessionId(): Promise<any> {
        return remove(`/api/v1/admin/user/session`);
    },
    async getSessionId(formData: {
        login: string;
        password: string;
    }): Promise<LoginResponse> {
        const { data } = await post(
            `/api/v1/admin/user/session?_fields=${userSessionID}`,
            formData
        );
        return data.result;
    },
    async restorePassword(formData: { login: string }): Promise<void> {
        const { data } = await post(`/api/v1/admin/user/restore-password`, {
            ...formData
        });
        return data.result;
    }
};
