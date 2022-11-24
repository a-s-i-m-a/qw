import { AddToSaleModalModal, ADD_TO_SALE_MODAL } from "./AddToSaleModal";
import { DeleteModal, DELETE_PRODUCT_MODAL } from "./DeleteModal";
import {
    DeletePromotionModal,
    DELETE_PRODUCT_PROMOTION_MODAL
} from "./DeletePromotion";
import { QRGenerationModal, QR_GENERATION_MODAL } from "./QRGenerationModal";
import { QRRequestModal, QR_REQUEST_MODAL } from "./QRRequestModal";
import {
    RemoveFromSaleModal,
    REMOVE_FROM_SALE_MODAL
} from "./RemoveFromSaleModal";

export const CatalogueModals = () => {
    return (
        <>
            <DeleteModal id={DELETE_PRODUCT_MODAL} />
            <QRGenerationModal id={QR_GENERATION_MODAL} />
            <RemoveFromSaleModal id={REMOVE_FROM_SALE_MODAL} />
            <AddToSaleModalModal id={ADD_TO_SALE_MODAL} />
            <DeletePromotionModal id={DELETE_PRODUCT_PROMOTION_MODAL} />
            <QRRequestModal id={QR_REQUEST_MODAL} />
        </>
    );
};
