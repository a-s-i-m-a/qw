import { FC } from "react";
import { Button } from "../../atoms/Button";
import { BackIcon } from "../../atoms/Icon";

interface BackButtonProps {
    onClick: () => void;
    className?: string;
}
export const BackButton: FC<BackButtonProps> = ({ onClick, className }) => {
    return (
        <Button
            onClick={onClick}
            className={className}
            type="icon"
            htmlType="button"
        >
            <BackIcon />
        </Button>
    );
};
