import { Lesson, LessonBlock, BonusLesson, Certificate } from "./../../types";
import { Level } from "../../types";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { CertificatesAPI } from "../../utils/api/requests/certificates-requests";

export class CertificatesStore {
    certificate: Certificate | null = null;
    levels: { items: Level[] } | null = null;
    level: Level | null = null;
    blocks: { items: LessonBlock[] } | null = null;
    lesson: Lesson | null = null;
    currentBlock: LessonBlock | null = null;
    bonusLesson: BonusLesson | null = null;
    search: string = "";
    isEditing: boolean = false;
    isLoading: boolean = false;
    tab: number = 0;

    constructor() {
        makeAutoObservable(this);
    }

    handleSearch = (value: string) => {
        this.search = value;
    };

    setLevels = (data: { items: Level[] }) => {
        this.levels = data;
    };

    setLevel = (data: Level) => {
        this.level = data;
    };

    setTab = (data: number) => {
        this.tab = data;
    };

    setBlocks = (data: { items: LessonBlock[] }) => {
        this.blocks = data;
    };

    setCurrentBlock = (data: LessonBlock) => {
        this.currentBlock = data;
    };

    setBonusLessons = (data: BonusLesson[]) => {
        if (this.level && this.level?.bonusLessons) {
            this.level.bonusLessons = data;
        }
    };

    setBonusLesson = (data: BonusLesson) => {
        this.bonusLesson = data;
    };

    clearLesson = () => {
        this.lesson = null;
    };

    clear = () => {
        this.level = null;
    };

    setEditing = (status: boolean) => {
        this.isEditing = status;
    };

    loadCertificate = async (id: string) => {
        this.isLoading = true;
        const data = await CertificatesAPI.getCertificate({ id });
        this.certificate = data;
        this.isLoading = false;
        return data;
    };

    loadLesson = async (id: string) => {
        this.isLoading = true;
        const data = await CertificatesAPI.getLesson({ id });
        this.lesson = data;
        this.isLoading = false;
        return data;
    };

    loadLevel = async (id: string) => {
        this.isLoading = true;
        const data = await CertificatesAPI.getLevel({ id });
        this.level = data;
        this.isLoading = false;
        return data;
    };

    loadBonusLesson = async (levelId: string, bonusId: string) => {
        this.isLoading = true;
        const data = await CertificatesAPI.getLevel({ id: levelId });
        const bonus = data?.bonusLessons?.find(item => item._id === bonusId);
        bonus && this.setBonusLesson(bonus);
        this.isLoading = false;
        return data;
    };

    loadLevels = async (sort: string, certificateId?: string) => {
        this.isLoading = true;
        const data = await CertificatesAPI.getLevelList({
            sort,
            certificateId
        });
        this.setLevels(data);
        this.isLoading = false;
        return data;
    };

    loadBlocks = async (levelId?: string) => {
        this.isLoading = true;
        const data = await CertificatesAPI.getBlockList({ levelId, sort: "sortNumber" });
        this.blocks = data;
        this.isLoading = false;
        return data;
    };

    updateOrCreateLesson = async (values: Partial<Lesson>) => {
        const formData = values;
        let data;
        if (this.lesson && this.lesson._id) {
            data = await CertificatesAPI.updateLesson({
                id: this.lesson._id,
                formData: {
                    ...formData,
                    certificateBlockId: undefined
                }
            });
            this.lesson = data;
        } else {
            data = await CertificatesAPI.createLesson({
                formData
            });
        }
        return data;
    };

    clearPagination = () => {
        this.tab = 0;
        this.search = "";
    };
}

export const certificatesStore = createContext(new CertificatesStore());
