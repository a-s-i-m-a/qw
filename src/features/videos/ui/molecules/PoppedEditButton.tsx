import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { BtnIcon } from "../../../../ui/atoms/Icon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { useModal } from "../../../modalpage/hooks";
import { videoStore } from "../../store/VideoStore";
import { VIDEO_DELETE_MODAL } from "../modals/DeleteModal";

export const PoppedEditButton: FC = observer(() => {
    const { t } = useTranslation();
    const history = useHistory();
    const { setEditing, video } = useContext(videoStore);
    const { setModalCallback, openModal } = useModal();
    const [referenceElement, setReference] = useState<HTMLDivElement | null>();
    const onOutside = () => {
        setOpened(false);
    };
    const [isOpened, setOpened] = useState(false);

    const handleClick = () => {
        setOpened(true);
    };

    const handleDelete = useCallback(() => {
        setModalCallback(VIDEO_DELETE_MODAL, () => {
            history.replace("/promotion");
        });
        openModal(VIDEO_DELETE_MODAL, {
            id: video?._id
        });
        setOpened(false);
    }, [history, openModal, setModalCallback, video?._id]);
    const handleEdit = useCallback(() => {
        setEditing(true);
        setOpened(false);
    }, [setEditing]);

    const popperItems = useMemo(
        () => [
            { label: t("edit"), action: handleEdit },
            {
                label: t("delete"),
                action: handleDelete
            }
        ],
        [t, handleEdit, handleDelete]
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
