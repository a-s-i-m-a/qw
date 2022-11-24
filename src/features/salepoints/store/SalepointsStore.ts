import { Salepoint } from "./../../types";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { SalepointsAPI } from "../../utils/api/requests/salepoints-requests";

export class SalepointsStore {
    salepoint: Salepoint | null = null;
    search: string = "";
    isEditing: boolean = false;
    coordinates: number[] = [];
    isEmpty: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    handleSearch = (value: string) => {
        this.setEmpty(false);
        this.search = value;
    };

    setSalepoints = (data: Salepoint | null) => {
        this.salepoint = data;
    };

    setCoordinates = (coordinates: number[]) => {
        this.coordinates = coordinates;
    };

    clear = () => {
        this.salepoint = null;
        this.isEditing = false;
        this.isEmpty = false;
    };

    setEditing = (status: boolean) => {
        this.isEditing = status;
    };

    setEmpty = (status: boolean) => {
        this.isEmpty = status;
    };

    getSalepoint = async (id: string) => {
        const data = await SalepointsAPI.getSalepoint({ id });
        this.setSalepoints(data);
        this.setCoordinates(data.location.coordinates);
        return data;
    };

    updateOrCreateSalepoint = async (values: Salepoint) => {
        const formData = values;
        let data;
        if (this.salepoint && this.salepoint._id) {
            data = await SalepointsAPI.updateSalepoint({
                id: this.salepoint._id,
                formData
            });
            this.salepoint = data;
        } else {
            data = await SalepointsAPI.createSalepoint({
                formData
            });
        }
        return data;
    };
}

export const salepointsStore = createContext(new SalepointsStore());
