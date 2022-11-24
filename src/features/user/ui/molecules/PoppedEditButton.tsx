import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { BtnIcon } from "../../../../ui/atoms/Icon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../ui/organisms/Toaster";
import { authStore } from "../../../auth/store/AuthStore";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { userStore } from "../../store/UserStore";
import { BLOCK_USER_MODAL } from "../modals/BlockUser";
import { DELETE_USER_MODAL } from "../modals/DeleteUser";
import { USER_EDIT_MODAL } from "../modals/EditUser";
import { UPDATE_PASSWORD_MODAL } from "../modals/UpdatePassword";

export const PoppedEditButton: FC = observer(() => {
    const { t } = useTranslation();
    const { logout } = useContext(authStore);

    const { openModal, setModalCallback } = useContext(modalPageStore);
    const { enableUserEditing, unblockUser, user, isMe, setUser } = useContext(
        userStore
    );

    const [referenceElement, setReference] = useState<HTMLDivElement | null>();
    const onOutside = () => {
        setOpened(false);
    };
    const history = useHistory();
    const [isOpened, setOpened] = useState(false);

    const handleClick = () => {
        setOpened(true);
    };

    const handleChangePassword = useCallback(() => {
        setOpened(false);

        openModal(UPDATE_PASSWORD_MODAL);
    }, [openModal]);

    const handleUserDelete = useCallback(() => {
        setOpened(false);

        setModalCallback(DELETE_USER_MODAL, isSuccess => {
            isSuccess && history.push("/users");
        });
        openModal(DELETE_USER_MODAL, { item: user });
    }, [history, openModal, setModalCallback, user]);

    const handleUserBlock = useCallback(() => {
        setOpened(false);

        setModalCallback(BLOCK_USER_MODAL, (isSuccess, updatedUser) => {
            isSuccess && setUser(updatedUser);
        });
        openModal(BLOCK_USER_MODAL, { item: user });
    }, [openModal, setModalCallback, setUser, user]);

    const handleEdit = useCallback(() => {
        if (user?.role === "user") {
            setModalCallback(USER_EDIT_MODAL, (isSuccess, updatedUser) => {
                isSuccess && setUser(updatedUser);
            });
            openModal(USER_EDIT_MODAL, { item: user });
        } else {
            enableUserEditing()
        }
    }, [user, enableUserEditing, setModalCallback, setUser, openModal])

    const handleUserUnblock = useCallback(async () => {
        setOpened(false);

        try {
            if (user && user._id) {
                await unblockUser({ id: user._id });
            }
            throwSuccessToast(
                t("hasBeenUnblocked", {
                    word: t(`${user!.role}.plural_0`)
                })
            );
        } catch {
            throwErrorToast(t("error"), t("unknownError"));
        }
    }, [t, unblockUser, user]);

    const popperItems = useMemo(
        () => [
            { label: t("edit"), action: handleEdit },

            {
                label: user?.isBlocked ? t("unblock") : t("block"),
                action: user?.isBlocked ? handleUserUnblock : handleUserBlock,
                isHidden: isMe
            },
            {
                label: t("delete"),
                action: handleUserDelete,
                isHidden: isMe
            },
            {
                label: t("changePassword"),
                action: handleChangePassword,
                isHidden: !isMe
            },

            { label: t("logout"), action: logout, isHidden: !isMe }
        ],
        [
            handleChangePassword,
            handleUserUnblock,
            handleUserBlock,
            handleUserDelete,
            logout,
            handleEdit,
            user,
            isMe,
            t
        ]
    );

    return (
        <div ref={setReference}>
            <Button onClick={handleClick} type={"icon"} htmlType="button">
                <BtnIcon />
            </Button>
            {referenceElement && isOpened && (
                <ActionPopper
                    referenceElement={referenceElement}
                    onOutside={onOutside}
                    items={popperItems}
                />
            )}
        </div>
    );
});
