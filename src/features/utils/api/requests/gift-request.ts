import { get, post, put, remove } from "../axiosConfig";
import axios, { Canceler } from "axios";
import { giftFields, giftListFields } from "../../../fields/gift";
import { ListResponse } from "../../../types";
import { GiftPayload } from "../../../gifts/types";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export const GiftAPI = {
    async getList({
        sort,
        limit,
        q,
        skip,
        search,
        role = "admin"
    }: {
        sort?: string;
        limit?: number;
        q?: string;
        skip?: number;
        search?: string;
        role?: "manufacturer" | "admin";
    }): Promise<ListResponse<GiftPayload>> {
        const params = {
            q: search,
            skip,
            limit,
            sort,
            _fields: giftListFields
        };
        if (cancel) {
            cancel();
        }
        const { data } = await get(`/api/v1/${role}/bonus-products`, {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });

        return data.result;
    },
    async createGift({
        formData,
        role = "admin"
    }: {
        formData: Partial<GiftPayload>;
        role?: "manufacturer" | "admin";
    }): Promise<GiftPayload> {
        const { data } = await post(`/api/v1/${role}/bonus-products`, formData);

        return data.result;
    },
    async updateGift({
        id,
        formData,
        role = "admin"
    }: {
        id: string;
        formData: Partial<GiftPayload>;
        role?: "manufacturer" | "admin";
    }): Promise<GiftPayload> {
        const params = {
            _fields: giftFields
        };

        const { data } = await put(
            `/api/v1/${role}/bonus-products/${id}`,
            formData,
            {
                params
            }
        );

        return data.result;
    },
    async removeGift({
        id,
        role = "admin"
    }: {
        id: string;
        role?: "manufacturer" | "admin";
    }): Promise<GiftPayload> {
        const params = {
            _fields: giftFields
        };
        const { data } = await remove(`/api/v1/${role}/bonus-products/${id}`, {
            params
        });

        return data.result;
    },
    async getGift({
        id,
        role = "admin",
        _fields = giftFields
    }: {
        id: string;
        role?: "manufacturer" | "admin";
        _fields?: string;
    }): Promise<GiftPayload> {
        const params = {
            _fields
        };
        const { data } = await get(`/api/v1/${role}/bonus-products/${id}`, {
            params
        });
        return data.result;
    }
};
