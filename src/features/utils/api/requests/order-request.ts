import { Order, OrderStatus } from "./../../../types";
import { get, post, put } from "../axiosConfig";
import axios, { Canceler } from "axios";
import { ListResponse } from "../../../types";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export type OrderType = "product" | "bonusProduct";

export const OrdersAPI = {
    async getList({
        sort,
        limit,
        q,
        skip,
        search,
        role = "manufacturer",
        userId,
        status,
        _fields,
        isQvinoOrder,
        type = "product"
    }: {
        sort?: string;
        limit?: number;
        q?: string;
        skip?: number;
        search?: string;
        role?: "manufacturer" | "admin";
        userId?: string;
        status?: string;
        _fields?: string;
        isQvinoOrder?: string;
        type?: OrderType;
    }): Promise<ListResponse<Order<false>>> {
        const params = {
            q: search,
            skip,
            limit,
            sort,
            _fields,
            "search[type]": type,
            "search[userId]": userId,
            "search[status]": status,
            "search[isQvinoOrder]": isQvinoOrder ? isQvinoOrder : undefined
        };
        if (cancel) {
            cancel();
        }
        const { data } = await get(`/api/v1/${role}/orders`, {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });

        return data.result;
    },
    async changeStatus({
        id,
        role = "admin",
        status,
        trackNumber,
        _fields
    }: {
        id: string;
        role?: "manufacturer" | "admin";
        status: OrderStatus;
        trackNumber?: string;
        _fields?: string;
    }): Promise<Order<false>> {
        const params = {
            _fields
        };
        const { data } = await put(
            `/api/v1/${role}/orders/${id}/status`,
            {
                status: status,
                trackNumber: trackNumber
            },
            {
                params
            }
        );
        return data.result;
    },
    async updateOrder({
        id,
        formData,
        role = "admin",
        trackNumber,
        status,
        _fields,
        type = "product"
    }: {
        id: string;
        formData?: Partial<Order<false>>;
        role?: "manufacturer" | "admin";
        trackNumber?: string;
        status?: string;
        _fields?: string;
        type?: OrderType;
    }): Promise<Order<false>> {
        const params = {
            _fields
        };

        const { data } = await put(
            `/api/v1/manufacturer/orders/${id}`,
            {
                ...formData,
                trackNumber,
                type
            },
            {
                params
            }
        );

        return data.result;
    },
    async cancelOrder({
        id,
        role = "admin",
        _fields
    }: {
        id: string;
        role?: "manufacturer" | "admin";
        _fields?: string;
    }): Promise<Order> {
        const params = {
            _fields
        };
        const { data } = await post(`/api/v1/${role}/orders/${id}/cancel`, {
            params
        });

        return data.result;
    },
    async getOrder({
        id,
        role = "admin",
        _fields
    }: {
        id: string;
        role?: "manufacturer" | "admin";
        _fields?: string;
    }): Promise<Order<false>> {
        const params = {
            _fields
        };
        const { data } = await get(`/api/v1/${role}/orders/${id}`, {
            params
        });
        return data.result;
    }
};
