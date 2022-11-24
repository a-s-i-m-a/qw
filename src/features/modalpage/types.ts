export type Modal<DType extends object | undefined> = {
    id: string;
    data?: DType;
    onModalClose?: () => void;
    onModalOpen?: () => void;
};
