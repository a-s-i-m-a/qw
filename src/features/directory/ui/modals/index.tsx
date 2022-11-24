import { DeleteModal, DIRECTORY_DELETE_MODAL } from "./DeleteModal";
import { GrapeSortModal, GRAPESORT_EDIT_MODAL } from "./GrapeSortModal";
import {
    ManufacturerModal,
    MANUFACTURER_EDIT_MODAL
} from "./ManufacturerModal";
import { RegionModal, REGION_EDIT_MODAL } from "./RegionModal";
import { RetailerModal, RETAILER_EDIT_MODAL } from "./RetailerModal";
import { WineStyleModal, WINESTYLE_EDIT_MODAL } from "./WineStyleModal";

export const DirectoryModals = () => {
    return (
        <>
            <DeleteModal id={DIRECTORY_DELETE_MODAL} />
            <ManufacturerModal id={MANUFACTURER_EDIT_MODAL} />
            <GrapeSortModal id={GRAPESORT_EDIT_MODAL} />
            <RegionModal id={REGION_EDIT_MODAL} />
            <WineStyleModal id={WINESTYLE_EDIT_MODAL} />
            <RetailerModal id={RETAILER_EDIT_MODAL} />
        </>
    );
};
