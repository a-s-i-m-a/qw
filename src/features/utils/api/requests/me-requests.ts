import { userFields } from "../../../fields/user";
import { get, put } from "../axiosConfig";
import { User } from "../../../types";

export const MeAPI = {
    async getProfile(): Promise<User> {
        const params = {
            _fields: userFields
        };

        const { data } = await get("/api/v1/me", { params });

        return data.result;
    },

    async updateProfile(user: Partial<User>): Promise<User> {
        const params = {
            _fields: userFields
        };

        const { data } = await put("/api/v1/user/settings", user, { params });

        return data.result;
    },

    async updateProfilePassword(user: Partial<User>): Promise<User> {
        const { oldPassword, password } = user;

        const params = {
            _fields: userFields
        };

        const { data } = await put(
            "/api/v1/user/password",
            { oldPassword, password },
            { params }
        );

        return data.result;
    }
};
