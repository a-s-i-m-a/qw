import { CancelModal, ORDER_CANCEL_MODAL } from "./CancelModal";
import { ChangeStatusModal, CHANGE_STATUS_MODAL } from "./ChangeStatusModal";
import { TrackModal, TRACK_EDIT_MODAL } from "./TrackModal";

export const OrdersModals = () => {
    return (
        <>
            <CancelModal id={ORDER_CANCEL_MODAL} />
            <TrackModal id={TRACK_EDIT_MODAL} />
            <ChangeStatusModal id={CHANGE_STATUS_MODAL} />
        </>
    );
};
