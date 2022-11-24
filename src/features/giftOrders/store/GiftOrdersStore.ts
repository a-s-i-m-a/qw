import { getFields } from '../../fields/orders';
import { Role } from "../../types";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { Order } from "../../types";
import { OrdersAPI, OrderType } from "../../utils/api/requests/order-request";
import { getGiftOrderFields } from '../../fields/giftOrders';

export class GiftOrdersStore {
    order: Order<false> | null = null;
    isEditing: boolean = false;
    isLoading: boolean = true;
    search: string = "";
    activeTab = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setOrder = (data: Order<false>) => {
        this.order = data;
    };

    loadOrder = async (id: string, role: Role) => {
        this.isLoading = true;
        const order = await OrdersAPI.getOrder({
            id,
            role: role === "manufacturer" ? "manufacturer" : "admin",
            _fields: getGiftOrderFields()
        });
        this.order = order;
        this.isLoading = false;
    };

    clear = () => {
        this.order = null;
        this.isLoading = true;
        this.isEditing = false;
    };

    setEditing = (status: boolean) => {
        this.isEditing = status;
    };

    updateOrder = async (formData: Partial<Order<false>>, type: OrderType = "product") => {
        let data;
        if (this.order && this.order._id) {
            data = await OrdersAPI.updateOrder({
                id: this.order._id,
                formData,
                _fields: type === "product" ? getFields() : getGiftOrderFields(),
                type: "bonusProduct"
            });
            this.order = data;
        }
        return data;
    };

    handleSearch = (value: string) => {
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

export const giftOrdersStore = createContext(new GiftOrdersStore());
