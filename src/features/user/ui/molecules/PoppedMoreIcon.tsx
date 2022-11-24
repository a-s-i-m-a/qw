import { observer } from "mobx-react-lite";
import React, {
    FC,
    useCallback,
    useContext,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { MoreIcon } from "../../../../ui/atoms/MoreIcon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { TableContext } from "../../../../ui/organisms/Table";
import {
    throwErrorToast,
    throwSuccessToast
} from "../../../../ui/organisms/Toaster";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { User } from "../../../types";
import { UserAPI } from "../../../utils/api/requests/user-requests";
import { useMutation } from "../../../utils/hooks/useMutation";
import { userStore } from "../../store/UserStore";
import { BLOCK_USER_MODAL } from "../modals/BlockUser";
import { DELETE_USER_MODAL } from "../modals/DeleteUser";
import { USER_EDIT_MODAL } from "../modals/EditUser";

interface PoppedMoreIconProps {
    user: User;
    restoreMode?: boolean;
}
export const PoppedMoreIcon: FC<PoppedMoreIconProps> = observer(
    ({ user, restoreMode }) => {
        const { openModal, setModalCallback } = useContext(modalPageStore);
        const { t } = useTranslation();
        const { refetch } = useContext(TableContext);
        const { enableUserEditing } = useContext(userStore);

        const history = useHistory();

        const [isOpened, setOpened] = useState(false);
        const [
            referenceElement,
            setReference
        ] = useState<HTMLDivElement | null>();
        const documentWidth = document.documentElement.clientWidth;
        const windowsWidth = window.innerWidth
        const scrollbarWidth = windowsWidth - documentWidth;
        const blockScroll = useCallback(( isOpened: boolean) => {
                if (isOpened) {
                    document.body.style.overflow = "hidden";
                    document.body.style.paddingRight = `${scrollbarWidth}px`
                } else {
                    document.body.style.overflow = "";
                    document.body.style.paddingRight = "0px"
                }
        }, [scrollbarWidth]);
        
        const onOutside = useCallback(() => {
            blockScroll(false);
            setOpened(false);
        }, [blockScroll]);


        const handleClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            setOpened(prev => {
                blockScroll(!prev);
                return !prev;
            })
        };

        const onDelete = useCallback(() => {
            setOpened(false);
            setModalCallback(DELETE_USER_MODAL, (isSuccess: boolean) => {
                isSuccess && refetch();
            });
            openModal(DELETE_USER_MODAL, { item: user });
        }, [openModal, refetch, setModalCallback, user]);

        const onBlock = useCallback(() => {
            setOpened(false);
            setModalCallback(BLOCK_USER_MODAL, (isSuccess: boolean) => {
                isSuccess && refetch();
            });
            openModal(BLOCK_USER_MODAL, { item: user });
        }, [openModal, refetch, setModalCallback, user]);

        const { mutate } = useMutation({
            fetchFn: UserAPI.unblockUser,
            onSuccess: () => {
                throwSuccessToast(
                    t("hasBeenUnblocked", {
                        word: t(`${user!.role}.plural_2`)
                    })
                );
                refetch();
            },
            onError: () => throwErrorToast(t("error"), t("unknownError"))
        });
        const onRestore = useCallback(async () => {
            setOpened(false);
            mutate({ id: user!._id });
        }, [mutate, user]);

        const onEdit = useCallback(() => {
            if (user!.role === "user") {
                setOpened(false);
                openModal(USER_EDIT_MODAL, { item: user });
            } else {
                enableUserEditing();
                history.push(`/user/${user._id}`);
            }
        }, [enableUserEditing, history, user, openModal]);

        const popperItems = useMemo(
            () => [
                {
                    label: t("edit"),
                    action: onEdit,
                    isHidden: restoreMode
                },
                {
                    label: t("restore"),
                    action: onRestore,
                    isHidden: !restoreMode
                },
                {
                    label: t("block"),
                    action: onBlock,
                    isHidden: restoreMode
                },

                { label: t("delete"), action: onDelete, isHidden: false }
            ],
            [t, onEdit, restoreMode, onRestore, onBlock, onDelete]
        );

        return (
            <div ref={setReference}>
                <MoreIcon
                    onClick={handleClick}
                    dotsColorClass={
                        isOpened
                            ? "text-white"
                            : "text-dark-main hover:text-white"
                    }
                    circleColorClass={
                        isOpened
                            ? "text-purple-main"
                            : "text-gray-light hover:text-purple-main"
                    }
                />
                {referenceElement && isOpened && (
                    <ActionPopper
                        referenceElement={referenceElement}
                        onOutside={onOutside}
                        items={popperItems.filter(item => !item.isHidden)}
                    />
                )}
            </div>
        );
    }
);
