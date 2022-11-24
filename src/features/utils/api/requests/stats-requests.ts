import { get } from "../axiosConfig";
import { ListResponse, PieChartData, StatsData } from "../../../types";
import { statsFields, statsListFields } from "../../../fields/stats";

export interface GraphFormData {
    from?: string;
    to?: string;
    countryId?: string;
    manufacturerId?: string;
    currency?: string;
    disableCancel?: boolean;
    status?: "completed" | "cancelled";
}

export const StatsAPI = {
    async getGraphData(formData?: GraphFormData): Promise<StatsData> {
        const params = {
            from: formData?.from,
            to: formData?.to,
            countryId: formData?.countryId,
            manufacturerId: formData?.manufacturerId,
            currency: formData?.currency,
            _fields: statsFields
        };

        const { data } = await get("/api/v1/admin/stats/sells", {
            params
        });

        return data.result;
    },
    async getOrderPieData(
        formData?: GraphFormData
    ): Promise<ListResponse<PieChartData>> {
        const params = {
            from: formData?.from,
            to: formData?.to,
            countryId: formData?.countryId,
            manufacturerId: formData?.manufacturerId,
            currency: formData?.currency,
            _fields: statsListFields
        };

        const { data } = await get(
            `/api/v1/admin/stats/charts/orders/${formData?.status}/pie`,
            {
                params
            }
        );

        return data.result;
    },
    async getSellsPieData(
        formData?: GraphFormData
    ): Promise<ListResponse<PieChartData>> {
        const params = {
            from: formData?.from,
            to: formData?.to,
            countryId: formData?.countryId,
            manufacturerId: formData?.manufacturerId,
            currency: formData?.currency,
            _fields: statsListFields
        };

        const { data } = await get(`/api/v1/admin/stats/charts/sells/pie`, {
            params
        });

        return data.result;
    },
    async getCommissionPieData(
        formData?: GraphFormData
    ): Promise<ListResponse<PieChartData>> {
        const params = {
            from: formData?.from,
            to: formData?.to,
            countryId: formData?.countryId,
            manufacturerId: formData?.manufacturerId,
            currency: formData?.currency,
            _fields: statsListFields
        };

        const { data } = await get(
            `/api/v1/admin/stats/charts/commission/pie`,
            {
                params
            }
        );

        return data.result;
    }
};
