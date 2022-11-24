import { getFields } from "./../../fields/orders";
import { PriceType, Role } from "./../../types";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { Items, Order, Product } from "../../types";
import { OrdersAPI } from "../../utils/api/requests/order-request";

export class OrdersStore {
    order: Order<false> | null = null;
    items: Items<Product>[] = [];
    dirtyItems: string[] = [];
    isEditing: boolean = false;
    isLoading: boolean = true;
    qvinoSearch: boolean = false;
    search: string = "";
    activeTab = 0;
    total: PriceType = { value: 0, currency: "usd" };

    constructor() {
        makeAutoObservable(this);
    }

    setQvinoSearch = (bool: boolean) => {
        this.qvinoSearch = bool;
    };

    setOrder = (data: Order<false>) => {
        this.order = data;
    };

    setTotal = (data: PriceType) => {
        this.total = data;
    };

    setItems = async (id: string, role: Role) => {
        const order = await OrdersAPI.getOrder({
            id,
            role: role === "manufacturer" ? "manufacturer" : "admin",
            _fields: getFields()
        });
        if (order?.items?.length) {
            this.items = [...order?.items];
        }
    };

    loadOrder = async (id: string, role: Role) => {
        this.isLoading = true;
        const order = await OrdersAPI.getOrder({
            id,
            role: role === "manufacturer" ? "manufacturer" : "admin",
            _fields: getFields()
        });
        if (order?.items?.length) {
            this.items = [...order?.items];
        }
        this.order = order;
        this.total = order.total;
        this.isLoading = false;
    };

    addQuantity = (id: string) => {
        let updatedItem = this.items.find(item => item?.product?._id === id);
        if (this.order && updatedItem?.product?.price?.value) {
            updatedItem.amount += 1;
            let newTotal = updatedItem?.product?.newPrice?.value
                ? this.total?.value + updatedItem?.product?.newPrice?.value
                : this.total?.value + updatedItem?.product?.price?.value;
            this.total = { ...this.total, value: newTotal };
        }
        if (!this.dirtyItems.includes(id)) {
            this.dirtyItems = [...this.dirtyItems, id];
        }
    };

    subQuantity = (id: string) => {
        let updatedItem = this.items.find(item => item?.product?._id === id);
        if (this.order && updatedItem?.product?.price?.value) {
            updatedItem.amount -= 1;
            let newTotal = updatedItem?.product?.newPrice?.value
                ? this.total.value - updatedItem?.product?.newPrice?.value
                : this.total.value - updatedItem?.product?.price?.value;
            this.total = { ...this.total, value: newTotal };
        }
        if (!this.dirtyItems.includes(id)) {
            this.dirtyItems = [...this.dirtyItems, id];
        }
    };

    clear = () => {
        this.order = null;
        this.items = [];
        this.dirtyItems = [];
        this.isLoading = true;
        this.isEditing = false;
        this.total = { value: 0, currency: "usd" };
    };
    setEditing = (status: boolean) => {
        this.isEditing = status;
    };

    updateOrder = async (formData: Partial<Order<false>>) => {
        let data;
        if (this.order && this.order._id) {
            data = await OrdersAPI.updateOrder({
                id: this.order._id,
                formData,
                _fields: getFields()
            });
            this.order = data;
            this.items = data.items || [];
            this.total = data.total;
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
        this.qvinoSearch = false;
    };
    clearDirtyItems = () => {
        this.dirtyItems = [];
    };
}

export const ordersStore = createContext(new OrdersStore());
