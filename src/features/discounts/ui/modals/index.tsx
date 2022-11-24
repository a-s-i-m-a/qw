import { DeleteDiscountModal, DELETE_DISCOUNT_MODAL } from "./DeleteDiscount";
import { EditDiscountModal, EDIT_DISCOUNT_MODAL } from "./EditDiscount";

export const DiscountModals = () => {
    return (
        <>
            <DeleteDiscountModal id={DELETE_DISCOUNT_MODAL} />
            <EditDiscountModal id={EDIT_DISCOUNT_MODAL} />
        </>
    );
};
