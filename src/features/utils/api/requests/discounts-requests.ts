import { get, post, put, remove } from "../axiosConfig";
import axios, { Canceler } from "axios";
import { Discounts, ListResponse } from "../../../types";
import {
    discountsListFields,
    discountsFields
} from "../../../fields/discounts";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export const DiscountsAPI = {
    async getList({
        sort,
        limit,
        skip,
        search,
        status,
        role = "admin"
    }: {
        sort?: string;
        limit?: number;
        q?: string;
        skip?: number;
        status?: string;
        search?: string;
        role?: "retailer" | "admin";
    }): Promise<ListResponse<Discounts>> {
        const params = {
            q: search,
            skip,
            limit,
            sort,
            "search[status]": status,
            _fields: discountsListFields
        };
        if (cancel) {
            cancel();
        }
        const { data } = await get(`/api/v1/${role}/actions`, {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });

        return data.result;
    },
    async createDiscount({
        formData
    }: {
        formData: Partial<Discounts>;
    }): Promise<Discounts> {
        const { data } = await post(
            `/api/v1/retailer/actions`,
            formData
        );

        return data.result;
    },
    async updateDiscount({
        id,
        formData
    }: {
        id: string;
        formData: Partial<Discounts>;
    }): Promise<Discounts> {
        const params = {
            _fields: discountsFields
        };

        const { data } = await put(
            `/api/v1/retailer/actions/${id}`,
            formData,
            {
                params
            }
        );

        return data.result;
    },
    async removeDiscount({ id }: { id: string }): Promise<Discounts> {
        const params = {
            _fields: discountsFields
        };
        const { data } = await remove(`/api/v1/retailer/actions/${id}`, {
            params
        });

        return data.result;
    },
    async getDiscount({
        id,
        _fields = discountsFields
    }: {
        id: string;
        _fields?: string;
    }): Promise<Discounts> {
        const params = {
            _fields
        };
        const { data } = await get(`/api/v1/retailer/actions/${id}`, {
            params
        });
        return data.result;
    },
    async changeStatus({
        id,
        role = "retailer",
        status = "accepted",
        _fields
    }: {
        id: string;
        role?: "retailer" | "admin";
        status?: "accepted" | "pending";
        _fields?: string;
    }): Promise<Discounts> {
        const params = {
            _fields
        };
        const { data } = await put(
            `/api/v1/retailer/actions/${id}/status`,
            { status: status },
            {
                params
            }
        );
        return data.result;
    }
};
