import { FC, Fragment } from "react";
import { observer } from "mobx-react-lite";
import { useClickOutside } from "../../../features/utils/hooks/useClickOutside";
import { Popper } from "../../organisms/Popper";
import { PopperItem } from "../../atoms/PopperItem";

interface ActionPopperProps {
    items?: { label: string; action: () => void; isHidden?: boolean }[];
    referenceElement: Element;
    onOutside: () => void;
}
export const ActionPopper: FC<ActionPopperProps> = observer(
    ({ onOutside, referenceElement, items }) => {
        useClickOutside(
            { current: referenceElement },
            onOutside,
            document.getElementById("root")!
        );

        return (
            <Popper referenceElement={referenceElement} offset={8}>
                {items &&
                    items.map(({ isHidden = false, label, action }) => (
                        <Fragment key={label}>
                            {isHidden === false && (
                                <PopperItem key={label} onClick={action}>
                                    {label}
                                </PopperItem>
                            )}
                        </Fragment>
                    ))}
            </Popper>
        );
    }
);
