import { Languages } from './../../types';
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { Video } from "../../types";
import { PromosAPI } from "../../utils/api/requests/promos-requests";
import { VideoPayload } from "../types";
import { transformVideoPayload } from "../utils/transformVideo";

export class VideoStore {
    constructor() {
        makeAutoObservable(this);
    }

    video: Video | null = null;
    isEditing: boolean = false;
    selectedLang: Languages | null = null;

    clear = () => {
        this.video = null;
        this.isEditing = false;
        this.selectedLang = null;
    };

    setSelectedLang = (lang: Languages | null) => {
        this.selectedLang = lang;
    };

    loadVideo = async (id: string) => {
        try {
            this.video = await PromosAPI.getVideo(id);
        } catch {
            window.history.back();
        }
    };

    setEditing = (flag: boolean) => {
        this.isEditing = flag;
    };

    updateOrCreateVideo = async (payload: VideoPayload) => {
        const formdata = transformVideoPayload(payload);
        let fn = PromosAPI.createVideo;

        if (this.video) {
            fn = PromosAPI.updateVideo;
        }

        const video = await fn(formdata);
        this.video = video;
        return video;
    };
}

export const videoStore = createContext(new VideoStore());
