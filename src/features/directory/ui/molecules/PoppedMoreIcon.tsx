import { observer } from "mobx-react-lite";
import React, {
    FC,
    RefObject,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { MoreIcon } from "../../../../ui/atoms/MoreIcon";
import { ActionPopper } from "../../../../ui/molecules/ActionPopper";
import { TableContext, TableControls } from "../../../../ui/organisms/Table";

interface PoppedMoreIconProps {
    tableRef: RefObject<TableControls>;
    onEdit: () => void;
    onDelete: () => void;
}
export const PoppedMoreIcon: FC<PoppedMoreIconProps> = observer(
    ({ onDelete, onEdit, tableRef }) => {
        const { t } = useTranslation();
        const [isOpened, setOpened] = useState(false);
        const { scrollRef } = useContext(TableContext);

        const [
            referenceElement,
            setReference
        ] = useState<HTMLDivElement | null>();
        const onOutside = () => {
            setOpened(false);
        };
        useEffect(() => {
            const table = scrollRef?.current;
            table?.addEventListener("scroll", onOutside);
            return () => {
                table?.removeEventListener("scroll", onOutside);
            };
        }, [scrollRef]);
        const handleClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            setOpened(prev => !prev);
        };

        const popperItems = useMemo(
            () => [
                {
                    label: t("edit"),
                    action: onEdit
                },
                { label: t("delete"), action: onDelete }
            ],
            [onDelete, onEdit, t]
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
                        items={popperItems}
                    />
                )}
            </div>
        );
    }
);
