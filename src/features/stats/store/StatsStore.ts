import { StatsData, ListResponse, PieChartData } from "./../../types";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import {
    GraphFormData,
    StatsAPI
} from "../../utils/api/requests/stats-requests";

export class StatsStore {
    graphData: StatsData | null = null;
    sellsPieData: ListResponse<PieChartData> | null = null;
    commissionPieData: ListResponse<PieChartData> | null = null;
    completedPieData: ListResponse<PieChartData> | null = null;
    cancelledPieData: ListResponse<PieChartData> | null = null;
    isLoading: boolean = false;
    activeTab = 0;

    constructor() {
        makeAutoObservable(this);
    }

    loadGraphData = async (formData: GraphFormData) => {
        this.isLoading = true;
        const data = await StatsAPI.getGraphData({
            ...formData
        });
        const filtered = data?.sellsByCountry?.filter(item => item.percent > 0);
        data.sellsByCountry = filtered;
        this.graphData = data;
        this.isLoading = false;
    };

    loadPieData = (
        sellsTab: number,
        sellsChartType: number,
        orderTab: number,
        orderChartType: number,
        args: GraphFormData
    ) => {
        if (this.activeTab === 1) {
            if (sellsTab === 0 && sellsChartType === 1) {
                this.loadSellsPieData({ ...args });
            }
            if (sellsTab === 1 && sellsChartType === 1) {
                this.loadCommissionPieData({ ...args });
            }
            if (orderTab === 0 && orderChartType === 1) {
                this.loadCompletedPieData({ ...args });
            }
            if (orderTab === 1 && orderChartType === 1) {
                this.loadCancelledPieData({ ...args });
            }
        }
    };

    loadSellsPieData = async (formData: GraphFormData) => {
        this.isLoading = true;
        const data = await StatsAPI.getSellsPieData({
            ...formData
        });
        const filtered = data?.items?.filter(item => item.percent > 0);
        data.items = filtered;
        this.sellsPieData = data;
        this.isLoading = false;
    };

    loadCommissionPieData = async (formData: GraphFormData) => {
        this.isLoading = true;
        const data = await StatsAPI.getCommissionPieData({
            ...formData
        });
        const filtered = data?.items?.filter(item => item.percent > 0);
        data.items = filtered;
        this.commissionPieData = data;
        this.isLoading = false;
    };

    loadCompletedPieData = async (formData: GraphFormData) => {
        this.isLoading = true;
        const data = await StatsAPI.getOrderPieData({
            ...formData,
            status: "completed"
        });
        const filtered = data?.items?.filter(item => item.percent > 0);
        data.items = filtered;
        this.completedPieData = data;
        this.isLoading = false;
    };

    loadCancelledPieData = async (formData: GraphFormData) => {
        this.isLoading = true;
        const data = await StatsAPI.getOrderPieData({
            ...formData,
            status: "cancelled"
        });
        const filtered = data?.items?.filter(item => item.percent > 0);
        data.items = filtered;
        this.cancelledPieData = data;
        this.isLoading = false;
    };

    clear = () => {
        this.graphData = null;
        this.cancelledPieData = null;
        this.completedPieData = null;
        this.commissionPieData = null;
        this.sellsPieData = null;
        this.isLoading = true;
    };
    setTab = (value: number) => {
        this.activeTab = value;
    };
    clearPagination = () => {
        this.activeTab = 0;
    };
}

export const statsStore = createContext(new StatsStore());
