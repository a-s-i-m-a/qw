import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { Discounts } from "../../types";
import { DiscountsAPI } from "../../utils/api/requests/discounts-requests";

export class DiscountsStore {
    discount: Discounts | null = null;
    isEditing: boolean = false;
    isLoading: boolean = true;
    isEmpty: boolean = false;
    search: string = "";
    activeTab = 0;

    constructor() {
        makeAutoObservable(this);
    }

    loadDiscount = async (id: string) => {
        this.isLoading = true;
        const discount = await DiscountsAPI.getDiscount({
            id
        });
        this.discount = discount;
        this.isLoading = false;
    };

    setDiscount = (data: Discounts) => {
        this.discount = data;
    };

    setEmpty = (status: boolean) => {
        this.isEmpty = status;
    };

    clear = () => {
        this.discount = null;
        this.isLoading = true;
        this.isEditing = false;
        this.isEmpty = false;
    };
    setEditing = (status: boolean) => {
        this.isEditing = status;
    };

    updateOrCreateDiscount = async (formData: Partial<Discounts>) => {
        let data;
        if (this.discount && this.discount._id) {
            data = await DiscountsAPI.updateDiscount({
                id: this.discount._id,
                formData
            });
            this.discount = data;
        } else {
            data = await DiscountsAPI.createDiscount({
                formData
            });
        }
        return data;
    };
    handleSearch = (value: string) => {
        this.setEmpty(false);
        this.search = value;
    };
    setTab = (value: number) => {
        this.activeTab = value;
    };
    clearPagination = () => {
        this.activeTab = 0;
        this.search = "";
    };
}

export const discountsStore = createContext(new DiscountsStore());
