import { Salepoint } from "./../../../types";
import { get, post, put, remove } from "../axiosConfig";
import axios, { Canceler } from "axios";
import { ListResponse } from "../../../types";
import {
    salepointsFields,
    salepointsListFields
} from "../../../fields/salepoints";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export const SalepointsAPI = {
    async getList({
        sort,
        limit,
        q,
        skip,
        search,
        retailerId
    }: {
        sort?: string;
        limit?: number;
        q?: string;
        skip?: number;
        search?: string;
        retailerId?: string;
    }): Promise<ListResponse<Salepoint>> {
        const params = {
            q: search,
            skip,
            limit,
            sort,
            "search[retailerId]": retailerId,
            _fields: salepointsListFields
        };
        if (cancel) {
            cancel();
        }
        const { data } = await get(`/api/v1/retailer/stores`, {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });

        return data.result;
    },
    async createSalepoint({
        formData,
        role = "admin"
    }: {
        formData: Partial<Salepoint>;
        role?: "manufacturer" | "admin";
    }): Promise<Salepoint> {
        const params = {
            _fields: salepointsFields
        };
        const { data } = await post(`/api/v1/retailer/stores`, formData, {
            params
        });

        return data.result;
    },
    async updateSalepoint({
        id,
        formData,
        role = "admin"
    }: {
        id: string;
        formData: Partial<Salepoint>;
        role?: "manufacturer" | "admin";
    }): Promise<Salepoint> {
        const params = {
            _fields: salepointsFields
        };

        const { data } = await put(`/api/v1/retailer/stores/${id}`, formData, {
            params
        });

        return data.result;
    },
    async removeSalepoint({
        id,
        role = "admin"
    }: {
        id: string;
        role?: "manufacturer" | "admin";
    }): Promise<Salepoint> {
        const params = {
            _fields: salepointsFields
        };
        const { data } = await remove(`/api/v1/retailer/stores/${id}`, {
            params
        });

        return data.result;
    },
    async getSalepoint({
        id,
        role = "admin",
        _fields = salepointsFields
    }: {
        id: string;
        role?: "manufacturer" | "admin";
        _fields?: string;
    }): Promise<Salepoint> {
        const params = {
            _fields
        };
        const { data } = await get(`/api/v1/retailer/stores/${id}`, {
            params
        });
        return data.result;
    }
};
