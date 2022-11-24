import { transformPayload } from './../utils/transformGift';
import { Gift, Languages } from "./../../types";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { transformToFormData } from "../utils/transformGift";
import { GiftAPI } from "../../utils/api/requests/gift-request";

export class GiftsStore {
    gift: Gift | null = null;
    search: string = "";
    isEditing: boolean = false;
    selectedLang: Languages | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setSelectedLang = (lang: Languages | null) => {
        this.selectedLang = lang;
    }

    handleSearch = (value: string) => {
        this.search = value;
    };

    setGift = (data: Gift | null) => {
        this.gift = data;
    };

    clear = () => {
        this.gift = null;
        this.isEditing = false;
    };

    setGiftEditing = (status: boolean) => {
        this.isEditing = status;
    };

    loadGift = async (id: string) => {
        const data = await GiftAPI.getGift({ id });
        const payloadData = transformPayload(data);
        this.setGift(payloadData);
        return data;
    };

    updateOrCreateGift = async (values: Gift) => {
        const formData = transformToFormData(values);
        let data;
        if (this.gift && this.gift._id) {
            data = await GiftAPI.updateGift({
                id: this.gift._id,
                formData
            });
            this.gift = transformPayload(data);
        } else {
            data = await GiftAPI.createGift({
                formData
            });
        }
        return data;
    };
}

export const giftsStore = createContext(new GiftsStore());