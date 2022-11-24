import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { AuthStoreInstance } from "../../auth/store/AuthStore";
import { ExpertTask, Review, Video } from "../../types";
import { PromosAPI } from "../../utils/api/requests/promos-requests";

export class TasksStore {
    search: string = "";
    activeTab = 0;

    task: ExpertTask | null = null;
    isEditing: boolean = false;
    isError: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    handleSearch = (value: string) => {
        this.search = value;
    };
    setTab = (value: number) => {
        this.activeTab = value;
    };

    clear = () => {
        this.isEditing = false;
        this.task = null;
    };

    load = async (id: string) => {
        try {
            this.task = await PromosAPI.getTask(
                id,
                AuthStoreInstance.user?.role === "expert" ? "expert" : "admin"
            );
        } catch {
            this.isError = true;
        }
    };
    setEditing = (flag: boolean) => {
        this.isEditing = flag;
    };
    completeTaskByExpert = async ({
        review,
        videoUrl
    }: {
        review?: Partial<Review>;
        videoUrl?: string;
    }) => {
        this.task = await PromosAPI.completeTask({
            id: this.task?._id!,
            review,
            videoUrl
        });
    };
    acceptTask = async ({
        review,
        video
    }: {
        review?: Partial<Review>;
        video?: Partial<Video>;
    }) => {
        this.task = await PromosAPI.acceptTask({
            id: this.task!._id,
            video,
            review
        });
    };
    rejectTask = async ({ reason }: { reason: string }) => {
        this.task = await PromosAPI.rejectTask({
            id: this.task!._id,
            reason
        });
    };
    clearPagination = () => {
        this.activeTab = 0;
        this.search = "";
    };
}

export const tasksStore = createContext(new TasksStore());
