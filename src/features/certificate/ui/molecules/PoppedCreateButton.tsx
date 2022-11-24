import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { useModal } from "../../../modalpage/hooks";
import { certificatesStore } from "../../store/CertificatesStore";
import { BLOCK_EDIT_MODAL } from "../modals/EditBlockModal";

interface PoppedEditButtonProps {
    id?: string;
}

export const PoppedCreateButton: FC<PoppedEditButtonProps> = observer(
    ({ id }) => {
        const { t } = useTranslation();
        const history = useHistory();
        const { setEditing, blocks, level, loadBlocks } = useContext(
            certificatesStore
        );
        const { pathname } = useLocation();
        const { setModalCallback, openModal } = useModal();
        const [
            referenceElement,
            setReference
        ] = useState<HTMLDivElement | null>();
        const onOutside = () => {
            setOpened(false);
        };
        const [isOpened, setOpened] = useState(false);

        const handleClick = () => {
            setOpened(true);
        };

        const onBonusLevelCreate = useCallback(() => {
            setOpened(false);
            setEditing(true);
            history.push(`${pathname}/create`);
        }, [history, pathname, setEditing]);

        const onBlockCreate = useCallback(() => {
            setOpened(false);
            setModalCallback(BLOCK_EDIT_MODAL, () => {
                loadBlocks(level?._id);
            });
            openModal(BLOCK_EDIT_MODAL, {
                item: {
                    id: level?._id,
                    defaultNumber: blocks?.items?.length
                        ? blocks?.items?.length + 1
                        : 1
                }
            });
        }, [
            setModalCallback,
            openModal,
            level?._id,
            blocks?.items?.length,
            loadBlocks
        ]);

        const popperItems = useMemo(
            () => [
                {
                    label: t("certificate.blocks.plural_0"),
                    action: onBlockCreate
                },
                {
                    label: t("certificate.bonusVideo.plural_0"),
                    action: onBonusLevelCreate
                }
            ],
            [t, onBlockCreate, onBonusLevelCreate]
        );

        return (
            <div ref={setReference}>
                <Button
                    onClick={handleClick}
                    htmlType="button"
                    text={t("create")}
                />
                {referenceElement && isOpened && (
                    <ActionPopper
                        referenceElement={referenceElement}
                        onOutside={onOutside}
                        items={popperItems}
                    />
                )}
            </div>
        );
    }
);
