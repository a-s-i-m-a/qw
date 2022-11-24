import { DeleteModal, PROMOTION_DELETE_MODAL } from "./DeleteModal";
import {
    PersonalOfferModal,
    PERSONAL_OFFER_REQUEST
} from "./PersonalOfferModal";
import { PROMOTION_SET_TASK_MODAL, SetTaskModal } from "./SetTaskModal";

export const PromotionModals = () => {
    return (
        <>
            <DeleteModal id={PROMOTION_DELETE_MODAL} />
            <SetTaskModal id={PROMOTION_SET_TASK_MODAL} />
            <PersonalOfferModal id={PERSONAL_OFFER_REQUEST} />
        </>
    );
};
