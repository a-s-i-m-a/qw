import { useContext } from "react";
import { ModalPageStore, modalPageStore } from "../store/ModalPageStore";

export const useModal = <DType extends Record<string, unknown> | undefined>() =>
    useContext<ModalPageStore<DType>>(modalPageStore);
