import axios, { Canceler } from "axios";
import { manufacturerListFields } from "../../../fields/directory";
import {
    grapeSortFields,
    grapeSortListFields
} from "../../../fields/grapeSort";
import { articleListFields } from "../../../fields/promo";
import {
    vineStyleFields,
    vineStyleListFields
} from "../../../fields/vineStyle";
import {
    ListResponse,
    GrapeSort,
    VineStyle,
    Country,
    Region,
    Manufacturer,
    Retailer,
    Article
} from "../../../types";
import { get, post, put, remove } from "../axiosConfig";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export const DirectoryAPI = {
    async getGrapeSorts(formData?: {
        skip?: number;
        limit?: number;
        search?: string;
        sort?: string;
        disableCancel?: boolean;
    }): Promise<ListResponse<GrapeSort>> {
        const params = {
            q: formData?.search,
            skip: formData?.skip,
            limit: formData?.limit,
            sort: formData?.sort,
            _fields: grapeSortListFields
        };
        if (cancel && !formData?.disableCancel) {
            cancel();
        }
        const { data } = await get("/api/v1/admin/grapesorts", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });

        return data.result;
    },
    async removeGrapeSort({ id }: { id: string }): Promise<GrapeSort> {
        const { data } = await remove(`/api/v1/admin/grapesorts/${id}`);

        return data.result;
    },
    async createGrapeSort(
        formData: Pick<GrapeSort<true>, "name" | "_id">
    ): Promise<Manufacturer> {
        const { _id, ...rest } = formData;

        const { data } = await post(`/api/v1/admin/grapesorts/`, rest, {
            params: {
                _fields: grapeSortFields
            }
        });

        return data.result;
    },
    async updateGrapeSort(
        formData: Pick<GrapeSort<true>, "name" | "_id">
    ): Promise<Manufacturer> {
        const { _id, ...rest } = formData;
        const { data } = await put(`/api/v1/admin/grapesorts/${_id}`, rest, {
            params: {
                _fields: grapeSortFields
            }
        });

        return data.result;
    },
    async getVineStyles(formData?: {
        skip?: number;
        limit?: number;
        search?: string;
        sort?: string;
        disableCancel?: boolean;
    }): Promise<ListResponse<VineStyle>> {
        const params = {
            q: formData?.search,
            skip: formData?.skip,
            limit: formData?.limit,
            sort: formData?.sort,
            _fields: vineStyleListFields
        };

        if (cancel && !formData?.disableCancel) {
            cancel();
        }
        const { data } = await get("/api/v1/admin/winestyles", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });

        return data.result;
    },
    async removeVineStyle({ id }: { id: string }): Promise<VineStyle> {
        const { data } = await remove(`/api/v1/admin/winestyles/${id}`);

        return data.result;
    },
    async createWineStyle(
        formData: Pick<VineStyle<true>, "name" | "_id">
    ): Promise<Manufacturer> {
        const { _id, ...rest } = formData;

        const { data } = await post(`/api/v1/admin/winestyles/`, rest, {
            params: {
                _fields: vineStyleFields
            }
        });

        return data.result;
    },
    async updateWineStyle(
        formData: Pick<VineStyle<true>, "name" | "_id">
    ): Promise<Manufacturer> {
        const { _id, ...rest } = formData;
        const { data } = await put(`/api/v1/admin/winestyles/${_id}`, rest, {
            params: {
                _fields: vineStyleFields
            }
        });

        return data.result;
    },
    async getCountries(formData?: {
        skip?: number;
        limit?: number;
        search?: string;
        sort?: string;
        disableCancel?: boolean;
    }): Promise<ListResponse<Country>> {
        const params = {
            q: formData?.search,
            skip: formData?.skip,
            limit: formData?.limit,
            sort: formData?.sort,
            _fields: "items(name,iso)"
        };
        if (cancel && !formData?.disableCancel) {
            cancel();
        }
        const { data } = await get("/api/v1/admin/countries", {
            cancelToken: !formData?.disableCancel
                ? new CancelToken(function executor(c) {
                      cancel = c;
                  })
                : undefined,
            params
        });

        return data.result;
    },

    async getRegions({
        countryId,
        ...formData
    }: {
        skip?: number;
        limit?: number;
        search?: string;
        sort?: string;
        countryId?: string;
        disableCancel?: boolean;
    }): Promise<ListResponse<Region>> {
        const params = {
            q: formData?.search,
            skip: formData?.skip,
            limit: formData?.limit,
            sort: formData?.sort,
            _fields: "items(country(name),name)",
            "search[countryId]": countryId
        };
        if (cancel && !formData?.disableCancel) {
            cancel();
        }
        const { data } = await get("/api/v1/admin/regions", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });

        return data.result;
    },
    async removeRegion({ id }: { id: string }): Promise<Region> {
        const { data } = await remove(`/api/v1/admin/regions/${id}`);

        return data.result;
    },
    async createRegion(
        formData: Pick<Region<true>, "countryId" | "name" | "_id">
    ): Promise<Region> {
        const { _id, ...rest } = formData;

        const { data } = await post(`/api/v1/admin/regions/`, rest, {
            params: {
                _fields: "country(name),name"
            }
        });

        return data.result;
    },
    async updateRegion(
        formData: Pick<Region<true>, "countryId" | "name" | "_id">
    ): Promise<Region> {
        const { _id, ...rest } = formData;

        const { data } = await put(`/api/v1/admin/regions/${_id}`, rest, {
            params: {
                _fields: "country(name),name"
            }
        });

        return data.result;
    },
    async getManufacturerArticles({
        sort,
        limit,
        q,
        skip,
        search,
        manufacturerId,
        _fields = articleListFields,
        role = "admin"
    }: {
        sort?: string;
        limit?: number;
        q?: string;
        skip?: number;
        search?: string;
        manufacturerId?: string;
        role?: "manufacturer" | "admin";
        _fields?: string;
    }): Promise<ListResponse<Article>> {
        const params = {
            q: search,
            skip,
            limit,
            sort,
            _fields,
            "search[manufacturerId]": manufacturerId
        };
        if (cancel) {
            cancel();
        }
        const { data } = await get(`/api/v1/admin/articles`, {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });

        return data.result;
    },
    async getManufacturers(formData?: {
        skip?: number;
        limit?: number;
        search?: string;
        sort?: string;
        countryId?: string;
        disableCancel?: boolean;
    }): Promise<ListResponse<Manufacturer>> {
        console.log("req", formData?.search);
        
        const params = {
            q: formData?.search,
            skip: formData?.skip,
            limit: formData?.limit,
            sort: formData?.sort,
            "search[countryId]": formData?.countryId,
            _fields: manufacturerListFields
        };
        if (cancel && !formData?.disableCancel) {
            cancel();
        }
        const { data } = await get("/api/v1/manufacturers", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });

        return data.result;
    },
    async getRetailers(formData?: {
        skip?: number;
        limit?: number;
        search?: string;
        sort?: string;
        disableCancel?: boolean;
    }): Promise<ListResponse<Retailer>> {
        const params = {
            q: formData?.search,
            skip: formData?.skip,
            limit: formData?.limit,
            sort: formData?.sort,
            _fields: "items(name,logo)"
        };
        if (cancel && !formData?.disableCancel) {
            cancel();
        }
        const { data } = await get("/api/v1/admin/retailers", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });

        return data.result;
    },
    async removeManufacturer({ id }: { id: string }): Promise<Manufacturer> {
        const { data } = await remove(`/api/v1/admin/manufacturers/${id}`);

        return data.result;
    },
    async createManufacturer(
        formData: Partial<
            Pick<
                Manufacturer<true>,
                "countryId" | "name" | "logoId" | "_id" | "articleId"
            >
        >
    ): Promise<Manufacturer> {
        const { _id, ...rest } = formData;

        const { data } = await post(`/api/v1/admin/manufacturers/`, rest, {
            params: {
                _fields: "name"
            }
        });

        return data.result;
    },
    async updateManufacturer(
        formData: Partial<
            Pick<
                Manufacturer<true>,
                "countryId" | "name" | "_id" | "logoId" | "articleId"
            >
        >
    ): Promise<Manufacturer> {
        const { _id, ...rest } = formData;
        const { data } = await put(`/api/v1/admin/manufacturers/${_id}`, rest, {
            params: {
                _fields: "name"
            }
        });

        return data.result;
    },
    async removeRetailer({ id }: { id: string }): Promise<Retailer> {
        const { data } = await remove(`/api/v1/admin/retailers/${id}`);

        return data.result;
    },
    async createRetailer(
        formData: Pick<Retailer, "name" | "logoId" | "_id">
    ): Promise<Retailer> {
        const { _id, ...rest } = formData;

        const { data } = await post(`/api/v1/admin/retailers/`, rest, {
            params: {
                _fields: "name"
            }
        });

        return data.result;
    },
    async updateRetailer(
        formData: Pick<Retailer, "name" | "logoId" | "_id">
    ): Promise<Retailer> {
        const { _id, ...rest } = formData;
        const { data } = await put(`/api/v1/admin/retailers/${_id}`, rest, {
            params: {
                _fields: "name"
            }
        });

        return data.result;
    }
};
