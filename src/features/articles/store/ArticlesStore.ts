import { Article, Languages } from "./../../types";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { PromosAPI } from "../../utils/api/requests/promos-requests";

export class ArticlesStore {
    constructor() {
        makeAutoObservable(this);
    }

    article: Article | null = null;
    isEditing: boolean = false;
    selectedLang: Languages | null = null;

    clear = () => {
        this.article = null;
        this.isEditing = false;
        this.selectedLang = null;
    };

    loadArticle = async (id: string) => {
        const data = await PromosAPI.getArticle({ id });
        this.article = data;
    };

    setSelectedLang = (lang: Languages | null) => {
        this.selectedLang = lang;
    }

    setEditing = (flag: boolean) => {
        this.isEditing = flag;
    };

    updateOrCreateArticle = async (values: Partial<Article>) => {
        const formData = values;
        let data;
        if (this.article && this.article._id) {
            data = await PromosAPI.updateArticle({
                id: this.article._id,
                formData
            });
            this.article = data;
        } else {
            data = await PromosAPI.createArticle({
                formData
            });
        }
        return data;
    };
}

export const articlesStore = createContext(new ArticlesStore());
