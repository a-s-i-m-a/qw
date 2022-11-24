import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { PromosAPI } from "../../utils/api/requests/promos-requests";
import { Article } from "../../types";

export class WineryStore {
    constructor() {
        makeAutoObservable(this);
    }

    article: Article | null = null;
    isLoading: boolean = false;

    clear = () => {
        this.article = null;
    };

    setLoading = (bool: boolean) => {
        this.isLoading = bool
    }

    loadArticle = async (id: string) => {
        const data = await PromosAPI.getArticle({
            id,
            role: "admin"
        });
        this.article = data;
        this.isLoading = false
    };
}

export const wineryStore = createContext(new WineryStore());
