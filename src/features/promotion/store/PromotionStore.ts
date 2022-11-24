import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { AuthStoreInstance } from "../../auth/store/AuthStore";
import { Product, Promo } from "../../types";
import { PromosAPI } from "../../utils/api/requests/promos-requests";
import { PromoPayload } from "../types";
import { transformPromoPayload } from "../utils/transformPromo";

export class PromotionStore {
    search: string = "";
    activeTab = 0;

    promo: Promo | null = null;
    isEditing: boolean = false;
    isError: boolean = false;
    forceProduct: Product | undefined;

    constructor() {
        makeAutoObservable(this);
    }

    loadPromo = async (id: string) => {
        try {
            const promo = await PromosAPI.getPromo({
                id,
                role:
                    AuthStoreInstance.user!.role === "manufacturer"
                        ? "manufacturer"
                        : "admin"
            });
            this.promo = promo;
            this.forceProduct = promo.product;
        } catch {
            this.isError = true;
        }
    };

    clear = () => {
        this.promo = null;
        this.isError = false;
        this.isEditing = false;
        this.forceProduct = undefined;
    };
    setEditing = (flag: boolean) => {
        this.isEditing = flag;
    };
    handleSearch = (value: string) => {
        this.search = value;
    };
    setTab = (value: number) => {
        this.activeTab = value;
    };
    setForceProduct = (value: Product) => {
        this.forceProduct = value;
    };
    createPromo = async (values: PromoPayload) => {
        const formData = transformPromoPayload(values);

        const promo = await PromosAPI.createPromo(formData);
        this.promo = promo;
        return promo;
    };
    acceptPromo = async (values: PromoPayload) => {
        const formData = transformPromoPayload(values);

        const promo = await PromosAPI.acceptPromo(this.promo!._id, formData);
        this.promo = promo;
        return promo;
    };
    clearPagination = () => {
        this.activeTab = 0;
        this.search = "";
    };
}

export const promotionStore = createContext(new PromotionStore());
