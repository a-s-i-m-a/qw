import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { AuthStoreInstance } from "../../auth/store/AuthStore";
import { ModalStoreInstance } from "../../modalpage/store/ModalPageStore";
import { Product } from "../../types";
import { CatalogueAPI } from "../../utils/api/requests/catalogue-requests";
import { DELETE_PRODUCT_MODAL } from "../ui/modals/DeleteModal";

export class CatalogueStore {
    productAwaitingForDeleting: string | null = null;
    product: Product | null = null;
    isProductEditing: boolean = false;
    isLoading: boolean = true;
    isError: boolean = false;
    qvinoSearch: boolean = false;
    search: string = "";
    activeTab = 0;

    constructor() {
        makeAutoObservable(this);
    }

    load = async (id: string) => {
        this.isLoading = true;
        try {
            const product = await CatalogueAPI.getProduct({
                id,
                role:
                    AuthStoreInstance.user?.role === "manufacturer"
                        ? "manufacturer"
                        : "admin"
            });

            this.product = product;
            this.isLoading = false;
        } catch {
            this.isError = true;
        }
    };

    setProduct = (data: Product) => {
        this.product = data;
    };

    setQvinoSearch = (bool: boolean) => {
        this.qvinoSearch = bool;
    }

    deleteProduct = (id: string) => {
        ModalStoreInstance.openModal(DELETE_PRODUCT_MODAL);
        this.productAwaitingForDeleting = id;
    };
    clearDeletingProduct = () => {
        this.productAwaitingForDeleting = null;
    };
    clear = () => {
        this.product = null;
        this.isLoading = true;
        this.isError = false;
        this.isProductEditing = false;
    };
    setProductEditing = (status: boolean) => {
        this.isProductEditing = status;
    };

    updateOrCreateProduct = async (formData: Partial<Product<true>>) => {
        let data;
        if (this.product) {
            data = await CatalogueAPI.updateProduct({
                id: this.product._id,
                formData,
                role:
                    AuthStoreInstance.user?.role === "manufacturer"
                        ? "manufacturer"
                        : "admin"
            });
            this.product = data;
        } else {
            data = await CatalogueAPI.createProduct({
                formData,
                role:
                    AuthStoreInstance.user?.role === "manufacturer"
                        ? "manufacturer"
                        : "admin"
            });
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
}

export const catalogueStore = createContext(new CatalogueStore());
