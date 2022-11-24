import axios, { Canceler } from "axios";
import {
    promoDetailsFields,
    promosListFields,
    reviewListFields,
    reviewDetailsFields,
    taskDetailsFields,
    tasksListFields,
    videoDetailsFields,
    videoListFields,
    articleListFields,
    articleFields
} from "../../../fields/promo";
import {
    Article,
    ExpertTask,
    ListResponse,
    Promo,
    Review,
    Video
} from "../../../types";
import { get, post, put, remove } from "../axiosConfig";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export const PromosAPI = {
    async getList({
        sort,
        limit,
        q,
        skip,
        search,
        role = "admin"
    }: {
        skip?: number;
        limit?: number;
        q?: string;
        sort?: string;
        search?: string;
        role?: "manufacturer" | "admin";
    }): Promise<ListResponse<Promo>> {
        const params = {
            q: search,
            skip,
            limit,
            sort,
            _fields: promosListFields,
            "search[status]": "new"
        };
        if (cancel) {
            cancel();
        }
        const { data } = await get(`/api/v1/${role}/promos`, {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });

        return data.result;
    },

    async getPromo({
        id,
        role = "admin"
    }: {
        id: string;
        role?: "manufacturer" | "admin";
    }): Promise<Promo> {
        const params = {
            _fields: promoDetailsFields
        };

        const { data } = await get(`/api/v1/${role}/promos/${id}`, { params });
        return data.result;
    },

    async rejectPromo({ id }: { id: string }): Promise<Promo> {
        const { data } = await post(`/api/v1/admin/promos/${id}/reject`);

        return data.result;
    },
    async removeApplication({ id }: { id: string }): Promise<Promo> {
        const { data } = await remove(`/api/v1/manufacturer/promos/${id}`);

        return data.result;
    },
    async getVideos({
        limit,
        q,
        skip,
        productId,
        _fields = videoListFields,
        sort,
        bypassCancel,
        search
    }: {
        skip?: number;
        limit?: number;
        q?: string;
        productId?: string;
        _fields?: string;
        bypassCancel?: boolean;
        sort?: string;
        search?: string;
    }): Promise<ListResponse<Video>> {
        const params = {
            q: search,
            skip,
            limit,
            _fields,
            sort,
            "search[productId]": productId
        };
        if (cancel && !bypassCancel) {
            cancel();
        }
        const { data } = await get("/api/v1/admin/videos", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });

        return data.result;
    },
    async getReviews({
        limit,
        q,
        skip,
        productId,
        _fields = reviewListFields,
        bypassCancel,
        sort,
        search
    }: {
        skip?: number;
        limit?: number;
        q?: string;
        productId?: string;
        _fields?: string;
        bypassCancel?: boolean;
        sort?: string;
        search?: string;
    }): Promise<ListResponse<Review>> {
        const params = {
            q: search,
            skip,
            limit,
            _fields,
            sort,
            "search[productId]": productId,
            "search[type]": "expert"
        };
        if (cancel && !bypassCancel) {
            cancel();
        }
        const { data } = await get("/api/v1/admin/reviews", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });

        return data.result;
    },
    async createPromo(formData: Partial<Promo>): Promise<Promo> {
        const params = {
            _fields: promoDetailsFields
        };
        const { data } = await post(`/api/v1/manufacturer/promos`, formData, {
            params
        });
        return data.result;
    },
    async createVideo(formData: Partial<Video>): Promise<Video> {
        const { data } = await post(`/api/v1/admin/videos`, formData);
        return data.result;
    },
    async updateVideo(formData: Partial<Video>): Promise<Video> {
        const params = {
            _fields: videoDetailsFields
        };
        if (!formData._id) {
            throw new Error("Forgot to provide _id");
        }
        const { data } = await put(
            `/api/v1/admin/videos/${formData._id}`,
            formData,
            {
                params
            }
        );
        return data.result;
    },
    async createReview(formData: Partial<Review>): Promise<Review> {
        const params = {
            _fields: reviewDetailsFields
        };
        const { data } = await post(`/api/v1/admin/reviews`, formData, {
            params
        });
        return data.result;
    },
    async updateReview(formData: Partial<Review>): Promise<Review> {
        const params = {
            _fields: reviewDetailsFields
        };
        if (!formData._id) {
            throw new Error("Forgot to provide _id");
        }
        const { data } = await put(
            `/api/v1/admin/reviews/${formData._id}`,
            formData,
            {
                params
            }
        );
        return data.result;
    },
    async acceptPromo(id: string, formData: Partial<Promo>): Promise<Promo> {
        const params = {
            _fields: promoDetailsFields
        };
        const { data } = await post(
            `/api/v1/admin/promos/${id}/accept`,
            formData,
            {
                params
            }
        );
        return data.result;
    },
    async removeVideo({ id }: { id: string }): Promise<Video> {
        const { data } = await remove(`/api/v1/admin/videos/${id}`);

        return data.result;
    },
    async removeReview({ id }: { id: string }): Promise<Review> {
        const { data } = await remove(`/api/v1/admin/reviews/${id}`);

        return data.result;
    },
    async getVideo(id: string): Promise<Video> {
        const params = {
            _fields: videoDetailsFields
        };

        const { data } = await get(`/api/v1/admin/videos/${id}`, { params });

        return data.result;
    },
    async getReview(id: string): Promise<Review> {
        const params = {
            _fields: reviewDetailsFields
        };

        const { data } = await get(`/api/v1/admin/reviews/${id}`, { params });

        return data.result;
    },
    async getTasks({
        sort,
        status,
        limit,
        q,
        skip,
        role = "admin",
        type,
        productId,
        search,
        bypassCancel,
        _fields = tasksListFields
    }: {
        sort?: string;
        skip?: number;
        limit?: number;
        q?: string;
        status?: string;
        role?: "expert" | "admin";
        type?: ExpertTask["type"];
        productId?: string;
        search?: string;
        bypassCancel?: boolean;
        _fields?: string;
    }): Promise<ListResponse<ExpertTask>> {
        const params = {
            q: search,
            skip,
            limit,
            "search[status]": status,
            "search[type]": type,
            "search[productId]": productId,
            _fields,
            sort
        };
        if (cancel && !bypassCancel) {
            cancel();
        }
        const { data } = await get(`/api/v1/${role}/tasks`, {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });

        return data.result;
    },

    async getTask(
        id: string,
        role: "expert" | "admin" = "admin"
    ): Promise<ExpertTask> {
        const params = {
            _fields: taskDetailsFields
        };

        const { data } = await get(`/api/v1/${role}/tasks/${id}`, { params });

        return data.result;
    },

    async createTask(task: Partial<ExpertTask>) {
        await post("/api/v1/admin/tasks", task);
    },
    async completeTask({
        id,
        review,
        videoUrl
    }: {
        id: string;
        review?: Partial<Review>;
        videoUrl?: string;
    }): Promise<ExpertTask> {
        const params = {
            _fields: taskDetailsFields
        };

        const { data } = await post(
            `/api/v1/expert/tasks/${id}`,
            {
                review,
                videoUrl
            },
            { params }
        );

        return data.result;
    },
    async acceptTask({
        id,
        review,
        video
    }: {
        id: string;
        review?: Partial<Review>;
        video?: Partial<Video>;
    }): Promise<ExpertTask> {
        const params = {
            _fields: taskDetailsFields
        };

        const { data } = await post(
            `/api/v1/admin/tasks/${id}/accept`,
            {
                review,
                video
            },
            { params }
        );

        return data.result;
    },
    async rejectTask({
        id,
        reason
    }: {
        id: string;
        reason: string;
    }): Promise<ExpertTask> {
        const params = {
            _fields: taskDetailsFields
        };
        const { data } = await post(
            `/api/v1/admin/tasks/${id}/reject`,
            {
                reason
            },
            { params }
        );

        return data.result;
    },
    async removeTask({ id }: { id: string }): Promise<ExpertTask> {
        const { data } = await remove(`/api/v1/admin/tasks/${id}`);

        return data.result;
    },

    async getArticleList({
        sort,
        limit,
        q,
        skip,
        search,
        _fields = articleListFields,
        role = "admin"
    }: {
        sort?: string;
        limit?: number;
        q?: string;
        skip?: number;
        search?: string;
        role?: "manufacturer" | "admin";
        _fields?: string;
    }): Promise<ListResponse<Article>> {
        const params = {
            q: search,
            skip,
            limit,
            sort,
            _fields
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
    async getArticle({
        id,
        role = "admin"
    }: {
        id: string;
        role?: "manufacturer" | "admin";
    }): Promise<Article> {
        const params = {
            _fields: articleFields
        };

        const { data } = await get(`/api/v1/${role}/articles/${id}`, {
            params
        });

        return data.result;
    },
    async createArticle({
        formData,
        role = "admin"
    }: {
        formData: Partial<Article>;
        role?: "manufacturer" | "admin";
    }): Promise<Article> {
        const params = {
            _fields: articleFields
        };

        const { data } = await post(`/api/v1/${role}/articles`, formData, {
            params
        });
        return data.result;
    },
    async updateArticle({
        id,
        formData,
        role = "admin"
    }: {
        id: string;
        formData: Partial<Article>;
        role?: "manufacturer" | "admin";
    }): Promise<Article> {
        const params = {
            _fields: articleFields
        };

        const { data } = await put(`/api/v1/${role}/articles/${id}`, formData, {
            params
        });

        return data.result;
    },
    async removeArticle({
        id,
        role = "admin"
    }: {
        id: string;
        role?: "manufacturer" | "admin";
    }): Promise<Article> {
        const params = {
            _fields: articleFields
        };
        const { data } = await remove(`/api/v1/${role}/articles/${id}`, {
            params
        });

        return data.result;
    }
};
