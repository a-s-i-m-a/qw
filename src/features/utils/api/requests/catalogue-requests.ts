import { get, post, remove, put } from "../axiosConfig";
import axios, { Canceler } from "axios";
import { ListResponse, PriceType, Product, ProductHash, Promo } from "../../../types";
import {
    productListFields,
    productDetailsFields
} from "../../../fields/product";
import { promoDetailsFields } from "../../../fields/promo";
import { productHashFields } from "../../../fields/productHash";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export type RequestType = "promo" | "article" | "productHash";

export const CatalogueAPI = {
    async getList({
        skip,
        search,
        limit,
        sort,
        isDeleted,
        saleStatus,
        role = "admin",
        isPromoted,
        isQvino
    }: {
        skip?: number;
        limit?: number;
        search?: string;
        sort?: string;
        isDeleted?: boolean;
        saleStatus?: string;
        isPromoted?: boolean;
        role?: "manufacturer" | "admin";
        isQvino?: boolean;
    }): Promise<ListResponse<Product>> {
        if (cancel) {
            cancel();
        }
        const params = {
            q: search,
            skip,
            limit,
            sort,
            _fields: productListFields,
            "search[isDeleted]": isDeleted,
            "search[isPromoted]": isPromoted,
            "search[saleStatus]": saleStatus,
            "search[isSoldByQvino]": isQvino ? isQvino : undefined
        };
        const { data } = await get(`/api/v1/${role}/products`, {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });
        return data.result;
    },
    async removeProduct({
        id,
        role = "admin"
    }: {
        id: string;
        role?: "manufacturer" | "admin";
    }): Promise<Product> {
        const params = {
            _fields: productDetailsFields
        };
        const { data } = await remove(`/api/v1/${role}/products/${id}`, {
            params
        });

        return data.result;
    },
    async removeFromStore({ id }: { id: string }): Promise<Product> {
        const params = {
            _fields: productDetailsFields
        };
        const { data } = await remove(
            `/api/v1/manufacturer/products/${id}/store`,
            {
                params
            }
        );

        return data.result;
    },
    async removeFromPromotion({ id }: { id: string }): Promise<Product> {
        const params = {
            _fields: productDetailsFields
        };
        const { data } = await remove(
            `/api/v1/manufacturer/products/${id}/promo`,
            {
                params
            }
        );

        return data.result;
    },
    async addToStore({
        id,
        stockCount,
        price
    }: {
        id: string;
        stockCount: number;
        price: PriceType;
    }): Promise<Product> {
        const params = {
            _fields: productDetailsFields
        };
        const { data } = await post(
            `/api/v1/manufacturer/products/${id}/store`,
            { stockCount, price },
            {
                params
            }
        );

        return data.result;
    },
    async restoreProduct({
        id,
        role = "admin"
    }: {
        id: string;
        role?: "manufacturer" | "admin";
    }): Promise<Product> {
        const params = {
            _fields: productDetailsFields
        };
        const { data } = await post(
            `/api/v1/${role}/products/${id}/restore`,
            {},
            {
                params
            }
        );

        return data.result;
    },

    async getProduct({
        id,
        role = "admin",
        _fields = productDetailsFields
    }: {
        id: string;
        role?: "manufacturer" | "admin";
        _fields?: string;
    }): Promise<Product> {
        const params = {
            _fields
        };
        const { data } = await get(`/api/v1/${role}/products/${id}`, {
            params
        });
        return data.result;
    },
    async getProductPromo({ id }: { id: string }): Promise<Promo> {
        const params = {
            _fields: `items(${promoDetailsFields})`,
            "search[productId]": id,
            "search[status]": "finished",
            limit: 1,
            sort: "createDate"
        };
        // const { data } = await get(`/api/v1/admin/products/${id}/promo`, {
        //     params
        // });
        const { data } = await get(`/api/v1/admin/promos/`, {
            params
        });
        return data.result.items?.[0];
    },

    async createProduct({
        formData,
        role = "admin"
    }: {
        formData: Partial<Product<true>>;
        role?: "manufacturer" | "admin";
    }): Promise<Product> {
        const { data } = await post(`/api/v1/${role}/products`, formData);

        return data.result;
    },
    async updateProduct({
        id,
        formData,
        role = "admin"
    }: {
        id: string;
        formData: Partial<Product<true>>;
        role?: "manufacturer" | "admin";
    }): Promise<Product> {
        const params = {
            _fields: productDetailsFields
        };

        const { data } = await put(`/api/v1/${role}/products/${id}`, formData, {
            params
        });

        return data.result;
    },
    async generateHashes ({
        id,
        count
    }: {
        id: string;
        count: number
    }): Promise<ProductHash> {
        const params = {
            _fields: productHashFields
        };
        const { data } = await post(`/api/v1/admin/products/${id}/hashes`, {count}, {
            params
        });
        
        return data.result;
    },
    async sendRequest ({
        type,
        text,
        productId
    }: {
        type: RequestType;
        text?: string;
        productId?: string;
    }): Promise<void> {
        const formData = {
            type,
            text,
            productId
        };
        const { data } = await post(`/api/v1/manufacturer/requests`, formData);
        
        return data.result;
    }
};
