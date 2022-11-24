import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { BtnIcon } from "../../../../ui/atoms/Icon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { useModal } from "../../../modalpage/hooks";
import { certificatesStore } from "../../store/CertificatesStore";
import { DELETE_LESSON_MODAL } from "../modals/DeleteLessonModal";

interface PoppedEditButtonProps {
    id?: string;
}

export const PoppedEditButtonLesson: FC<PoppedEditButtonProps> = observer(
    ({ id }) => {
        const { t } = useTranslation();
        const history = useHistory();
        const { setEditing, lesson } = useContext(certificatesStore);
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

        const onEdit = useCallback(async () => {
            setEditing(true);
        }, [setEditing]);

        const onDelete = useCallback(() => {
            setOpened(false);
            setModalCallback(DELETE_LESSON_MODAL, () => {
                history.goBack();
            });
            openModal(DELETE_LESSON_MODAL, { item: lesson });
        }, [lesson, history, openModal, setModalCallback]);

        const popperItems = useMemo(
            () => [
                {
                    label: t("edit"),
                    action: onEdit
                },
                {
                    label: t("delete"),
                    action: onDelete
                }
            ],
            [t, onEdit, onDelete]
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
    }
);
