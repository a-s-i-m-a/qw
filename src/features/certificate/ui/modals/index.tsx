import { AddLevelModal, ADD_LEVEL_MODAL } from "./AddLevelModal";
import {
    AddCertificateModal,
    ADD_CERTIFICATE_MODAL
} from "./AddCertificateModal";
import {
    DeleteCertificateModal,
    DELETE_CERTIFICATE_MODAL
} from "./DeleteCertificateModal";
import { BlockModal, BLOCK_EDIT_MODAL } from "./EditBlockModal";
import {
    UnpublishCertificateModal,
    UNPUBLISH_CERTIFICATE_MODAL
} from "./UnpublishCertificate";
import { DeleteLevelModal, DELETE_LEVEL_MODAL } from "./DeleteLevelModal";
import { UnpublishLevelModal, UNPUBLISH_LEVEL_MODAL } from "./UnpublishLevel";
import { DeleteLessonModal, DELETE_LESSON_MODAL } from "./DeleteLessonModal";
import { DeleteBlockModal, DELETE_BLOCK_MODAL } from "./DeleteBlockModal";
import {
    DeleteBonusLessonModal,
    DELETE_BONUSLESSON_MODAL
} from "./DeleteBonusLessonModal";

export const CoursesModals = () => {
    return (
        <>
            <UnpublishCertificateModal id={UNPUBLISH_CERTIFICATE_MODAL} />
            <UnpublishLevelModal id={UNPUBLISH_LEVEL_MODAL} />
            <BlockModal id={BLOCK_EDIT_MODAL} />
            <AddLevelModal id={ADD_LEVEL_MODAL} />
            <AddCertificateModal id={ADD_CERTIFICATE_MODAL} />
            <DeleteCertificateModal id={DELETE_CERTIFICATE_MODAL} />
            <DeleteLevelModal id={DELETE_LEVEL_MODAL} />
            <DeleteLessonModal id={DELETE_LESSON_MODAL} />
            <DeleteBlockModal id={DELETE_BLOCK_MODAL} />
            <DeleteBonusLessonModal id={DELETE_BONUSLESSON_MODAL} />
        </>
    );
};
