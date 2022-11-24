import { Lesson, LessonBlock } from "./../../../types";
import {
    blockListFields,
    lessonFields,
    levelFields
} from "./../../../fields/certificates";
import { get, post, put, remove } from "../axiosConfig";
import axios, { Canceler } from "axios";
import { ListResponse, Certificate, Level } from "../../../types";
import {
    certificateFields,
    certificateListFields,
    levelListFields
} from "../../../fields/certificates";

const CancelToken = axios.CancelToken;
let cancel: Canceler | undefined;

export const CertificatesAPI = {
    async getCertificatesList({
        sort,
        limit,
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
    }): Promise<ListResponse<Certificate>> {
        const params = {
            q: search,
            skip,
            limit,
            sort,
            _fields: certificateListFields
        };
        if (cancel) {
            cancel();
        }
        const { data } = await get(`/api/v1/admin/certificates`, {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
            params
        });

        return data.result;
    },
    async changeCertificateStatus({
        id,
        role = "manufacturer",
        status,
        _fields
    }: {
        id: string;
        role?: "manufacturer" | "admin";
        status: "pending" | "published";
        _fields?: string;
    }): Promise<Certificate> {
        const params = {
            _fields
        };
        const { data } = await put(
            `/api/v1/admin/certificates/${id}/status`,
            {
                status: status
            },
            {
                params
            }
        );
        return data.result;
    },
    async getCertificate({
        id,
        role = "admin",
        _fields = certificateFields
    }: {
        id: string;
        role?: "manufacturer" | "admin";
        _fields?: string;
    }): Promise<Certificate> {
        const params = {
            _fields
        };
        const { data } = await get(`/api/v1/admin/certificates/${id}`, {
            params
        });
        return data.result;
    },
    async createCertificate({
        formData,
        role = "admin"
    }: {
        formData: Partial<Certificate>;
        role?: "manufacturer" | "admin";
    }): Promise<Certificate> {
        const { data } = await post(`/api/v1/admin/certificates`, formData);
        return data.result;
    },
    async removeCertificate({
        id,
        role = "admin"
    }: {
        id: string;
        role?: "manufacturer" | "admin";
    }): Promise<Certificate> {
        const params = {
            _fields: certificateFields
        };
        const { data } = await remove(`/api/v1/admin/certificates/${id}`, {
            params
        });

        return data.result;
    },
    async getLevelList({
        sort,
        limit,
        q,
        skip,
        search,
        role = "admin",
        certificateId
    }: {
        sort?: string;
        limit?: number;
        q?: string;
        skip?: number;
        search?: string;
        role?: "manufacturer" | "admin";
        certificateId?: string;
    }): Promise<ListResponse<Level>> {
        const params = {
            q,
            skip,
            limit,
            sort,
            search,
            _fields: levelListFields,
            "search[certificateId]": certificateId
        };
        const { data } = await get(`/api/v1/admin/certificate-levels`, {
            params
        });
        return data.result;
    },
    async getLevel({
        id,
        role = "admin",
        _fields = levelFields
    }: {
        id: string;
        role?: "manufacturer" | "admin";
        _fields?: string;
    }): Promise<Level> {
        const params = {
            _fields
        };
        const { data } = await get(`/api/v1/admin/certificate-levels/${id}`, {
            params
        });
        return data.result;
    },
    async createLevel({
        formData,
        role = "admin"
    }: {
        formData: Partial<Level>;
        role?: "manufacturer" | "admin";
    }): Promise<Level> {
        const { data } = await post(
            `/api/v1/admin/certificate-levels`,
            formData
        );

        return data.result;
    },
    async updateLevel({
        id,
        formData,
        role = "admin"
    }: {
        id?: string;
        formData: Partial<Level>;
        role?: "manufacturer" | "admin";
    }): Promise<Level> {
        const params = {
            _fields: levelFields
        };

        const { data } = await put(
            `/api/v1/admin/certificate-levels/${id ? id : formData._id}`,
            formData,
            {
                params
            }
        );

        return data.result;
    },
    async removeLevel({
        id,
        role = "admin"
    }: {
        id: string;
        role?: "manufacturer" | "admin";
    }): Promise<Level> {
        const params = {
            _fields: levelFields
        };
        const { data } = await remove(
            `/api/v1/admin/certificate-levels/${id}`,
            {
                params
            }
        );

        return data.result;
    },
    async changeLevelStatus({
        id,
        role = "manufacturer",
        status,
        _fields
    }: {
        id: string;
        role?: "manufacturer" | "admin";
        status: "pending" | "published";
        _fields?: string;
    }): Promise<Level> {
        const params = {
            _fields
        };
        const { data } = await put(
            `/api/v1/admin/certificate-levels/${id}/status`,
            {
                status: status
            },
            {
                params
            }
        );
        return data.result;
    },
    async getBlockList({
        sort,
        limit,
        q,
        skip,
        search,
        role = "admin",
        levelId
    }: {
        sort?: string;
        limit?: number;
        q?: string;
        skip?: number;
        search?: string;
        role?: "manufacturer" | "admin";
        levelId?: string;
    }): Promise<ListResponse<LessonBlock>> {
        const params = {
            q,
            skip,
            limit,
            sort,
            search,
            _fields: blockListFields,
            "search[certificateLevelId]": levelId
        };
        const { data } = await get(`/api/v1/admin/certificate-blocks`, {
            params
        });
        return data.result;
    },
    async createBlock({
        formData,
        role = "admin"
    }: {
        formData: Partial<LessonBlock>;
        role?: "manufacturer" | "admin";
    }): Promise<LessonBlock> {
        const { data } = await post(
            `/api/v1/admin/certificate-blocks`,
            formData
        );

        return data.result;
    },
    async updateBlock({
        id,
        formData,
        role = "admin"
    }: {
        id: string;
        formData: Partial<LessonBlock>;
        role?: "manufacturer" | "admin";
    }): Promise<LessonBlock> {
        const params = {
            _fields: levelFields
        };

        const { data } = await put(
            `/api/v1/admin/certificate-blocks/${id || formData._id}`,
            formData,
            {
                params
            }
        );

        return data.result;
    },
    async removeBlock({
        id,
        role = "admin"
    }: {
        id: string;
        role?: "manufacturer" | "admin";
    }): Promise<LessonBlock> {
        const params = {
            _fields: levelFields
        };
        const { data } = await remove(
            `/api/v1/admin/certificate-blocks/${id}`,
            {
                params
            }
        );

        return data.result;
    },
    async createLesson({
        formData,
        role = "admin"
    }: {
        formData: Partial<Lesson>;
        role?: "manufacturer" | "admin";
    }): Promise<Lesson> {
        const { data } = await post(
            `/api/v1/admin/certificate-lessons`,
            formData
        );

        return data.result;
    },
    async updateLesson({
        id,
        formData,
        role = "admin"
    }: {
        id: string;
        formData: Partial<Lesson>;
        role?: "manufacturer" | "admin";
    }): Promise<Lesson> {
        const params = {
            _fields: lessonFields
        };

        const { data } = await put(
            `/api/v1/admin/certificate-lessons/${id || formData._id}`,
            formData,
            {
                params
            }
        );

        return data.result;
    },
    async getLesson({
        id,
        role = "admin",
        _fields = lessonFields
    }: {
        id: string;
        role?: "manufacturer" | "admin";
        _fields?: string;
    }): Promise<Lesson> {
        const params = {
            _fields
        };
        const { data } = await get(`/api/v1/admin/certificate-lessons/${id}`, {
            params
        });
        return data.result;
    },
    async removeLesson({
        id,
        role = "admin"
    }: {
        id: string;
        role?: "manufacturer" | "admin";
    }): Promise<Level> {
        const params = {
            _fields: lessonFields
        };
        const { data } = await remove(
            `/api/v1/admin/certificate-lessons/${id}`,
            {
                params
            }
        );

        return data.result;
    }
};
