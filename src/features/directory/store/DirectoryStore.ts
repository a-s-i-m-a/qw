import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class DirectoryStore {
    search: string = "";
    activeTab = 0;

    constructor() {
        makeAutoObservable(this);
    }

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

export const directoryStore = createContext(new DirectoryStore());
