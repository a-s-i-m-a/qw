import { UpdatePasswordModal, UPDATE_PASSWORD_MODAL } from "./UpdatePassword";
import { DeleteUserModal, DELETE_USER_MODAL } from "./DeleteUser";
import { BlockUserModal, BLOCK_USER_MODAL } from "./BlockUser";
import { UserEditModal, USER_EDIT_MODAL } from "./EditUser";

export const UserModals = () => {
    return (
        <>
            <UpdatePasswordModal id={UPDATE_PASSWORD_MODAL} />
            <DeleteUserModal id={DELETE_USER_MODAL} />
            <BlockUserModal id={BLOCK_USER_MODAL} />
            <UserEditModal id={USER_EDIT_MODAL} />
        </>
    );
};
