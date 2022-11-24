import { createContext } from "react";
import { makeAutoObservable } from "mobx";
import { Modal } from "../types";

export class ModalPageStore<DType extends object | undefined> {
    constructor() {
        makeAutoObservable(this);
    }

    activeModalId: string | null = null;
    history: string[] = [];
    modals: Modal<DType>[] = [];
    modalCallback: Record<string, (...args: any[]) => void> = {};

    register = (modal: Modal<DType>) => {
        this.modals = [...this.modals, { ...modal, data: modal.data }];
    };

    getModalById = (id: string) => {
        return this.modals.find(modal => modal.id === id);
    };

    get activeModalHooks() {
        let target;
        if (this.activeModalId) {
            target = this.getModalById(this.activeModalId);
        }

        return {
            onModalClose: target?.onModalClose,
            onModalOpen: target?.onModalOpen
        };
    }

    get prevModalHooks() {
        const target = this.getModalById(
            this.history[this.history.indexOf(this.history.slice(-1)[0]) - 1]
        );

        return {
            onModalClose: target?.onModalClose,
            onModalOpen: target?.onModalOpen
        };
    }

    get modalData() {
        return this.getModalById(this.activeModalId!)?.data;
    }

    pushToHistory = (id: string) => {
        this.history.push(id);
    };

    removeFromHistory = (id: string) => {
        this.history = this.history.filter(_id => _id !== id);
    };

    clearHistory = () => {
        this.history = [];
    };

    get historyLastItem() {
        return this.history.slice(-1)[0];
    }

    setActiveModalId = (id: string) => {
        this.activeModalId = id;
    };

    clearActiveModalId = () => {
        this.activeModalId = null;
    };

    clearCurrentState = () => {
        this.clearActiveModalId();
        this.clearHistory();
    };

    openModal = (id: string, data?: DType) => {
        if (data) {
            this.modals = this.modals.map(item => {
                if (item.id === id) {
                    return { id, data: { ...item.data, ...data } };
                }
                return item;
            });
        }

        this.setActiveModalId(id);
        this.pushToHistory(id);

        const activeModalOpenHook = this.activeModalHooks.onModalOpen;
        const prevModalCloseHook = this.prevModalHooks.onModalClose;

        if (this.history.length > 1) {
            prevModalCloseHook && prevModalCloseHook();
        }

        activeModalOpenHook && activeModalOpenHook();
    };

    closeModal = () => {
        this.modals = this.modals.map(item => {
            if (item.id === this.activeModalId) {
                return { id: item.id, data: undefined };
            }
            return item;
        });

        const activeModalCloseHook = this.activeModalHooks.onModalClose;

        if (this.history.length === 1) {
            activeModalCloseHook && activeModalCloseHook();
            this.clearCurrentState();
        } else {
            this.removeFromHistory(this.activeModalId!);
            activeModalCloseHook && activeModalCloseHook();

            this.setActiveModalId(this.historyLastItem);

            if (this.activeModalHooks.onModalOpen)
                this.activeModalHooks.onModalOpen();
        }
    };
    setModalCallback = (modal: string, cb: (...args: any[]) => void) => {
        this.modalCallback[modal] = cb;
    };
}

export const ModalStoreInstance: ModalPageStore<any> = new ModalPageStore();

export const modalPageStore = createContext(ModalStoreInstance);
