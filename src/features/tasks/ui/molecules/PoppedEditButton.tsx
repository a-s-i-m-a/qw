import { observer } from "mobx-react-lite";
import { FC, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { BtnIcon } from "../../../../ui/atoms/Icon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { modalPageStore } from "../../../modalpage/store/ModalPageStore";
import { tasksStore } from "../../store/TasksStore";
import { DELETE_TASK_MODAL } from "../modals/DeleteTask";

export const PoppedEditButton: FC = observer(() => {
    const { t } = useTranslation();

    const { openModal, setModalCallback } = useContext(modalPageStore);
    const { task } = useContext(tasksStore);

    const [referenceElement, setReference] = useState<HTMLDivElement | null>();
    const onOutside = () => {
        setOpened(false);
    };
    const history = useHistory();
    const [isOpened, setOpened] = useState(false);

    const handleClick = () => {
        setOpened(true);
    };

    const handleDelete = useCallback(() => {
        setOpened(false);

        setModalCallback(DELETE_TASK_MODAL, isSuccess => {
            isSuccess && history.push("/tasks");
        });
        openModal(DELETE_TASK_MODAL, { item: task });
    }, [history, openModal, setModalCallback, task]);

    const popperItems = useMemo(
        () => [
            {
                label: t("deleteTask"),
                action: handleDelete
            }
        ],
        [t, handleDelete]
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
