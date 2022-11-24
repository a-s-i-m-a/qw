import { get, post, put, remove } from "../axiosConfig";
import { ListResponse, User } from "../../../types";
import { userFields } from "../../../fields/user";
import axios, { Canceler } from "axios";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export const UserAPI = {
    async getList({
        skip,
        search,
        limit,
        sort,
        role
    }: {
        skip?: number;
        limit?: number;
        search?: string;
        sort?: string;
        role?: string;
    }): Promise<ListResponse<User>> {
        if (cancel) {
            cancel();
        }
        const params = {
            q: search,
            skip,
            limit,
            sort,
            _fields: `items(${userFields})`,
            "search[role]": role
        };
        const { data } = await get("/api/v1/admin/users", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });
        return data.result;
    },
    async getUser(id: string): Promise<User> {
        const params = {
            _fields: userFields
        };

        const { data } = await get(`/api/v1/admin/users/${id}`, { params });

        return data.result;
    },

    async updateUser(formData: Partial<User>): Promise<User> {
        const params = {
            _fields: userFields
        };
        const { _id, ...rest } = formData;

        const { data } = await put(`/api/v1/admin/users/${_id}`, rest, {
            params
        });

        return data.result;
    },

    async createUser(formData: Partial<User>): Promise<User> {
        const params = {
            _fields: userFields
        };

        const { data } = await post(`/api/v1/admin/users`, formData, {
            params
        });

        return data.result;
    },

    async removeUser({ id }: { id: string }): Promise<User> {
        const params = {
            _fields: userFields
        };
        const { data } = await remove(`/api/v1/admin/users/${id}`, {
            params
        });

        return data.result;
    },

    async blockUser({ id }: { id: string }): Promise<User> {
        const params = {
            _fields: userFields
        };
        const { data } = await put(
            `/api/v1/admin/users/${id}/block`,
            {},
            {
                params
            }
        );

        return data.result;
    },

    async unblockUser({ id }: { id: string }): Promise<User> {
        const params = {
            _fields: userFields
        };
        const { data } = await put(
            `/api/v1/admin/users/${id}/unblock`,
            {},
            {
                params
            }
        );

        return data.result;
    },

    async updateUserPassword(user: Partial<User>, id: string): Promise<User> {
        const { oldPassword, password } = user;

        const params = {
            _fields: userFields
        };

        const { data } = await put(
            `/api/v1/admin/users/${id}/password`,
            { oldPassword, password },
            { params }
        );

        return data.result;
    }
};
