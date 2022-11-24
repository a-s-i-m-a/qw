import { FC } from "react";
import {
    DiagIconActive,
    DiagIconDisabled,
    GrafIconActive,
    GrafIconDisabled
} from "../../../../ui/atoms/Icon";
import { IconButton } from "../../../articles/ui/atoms/IconButton";

interface ChartTypeBtnsProps {
    selectedChart: number;
    onGrafClick?: () => void;
    onDiagClick?: () => void;
}

export const ChartTypeBtns: FC<ChartTypeBtnsProps> = ({
    selectedChart,
    onGrafClick,
    onDiagClick
}) => {
    return (
        <section className="relative flex items-center">
            <IconButton
                isActive={selectedChart === 0}
                onClick={onGrafClick}
                className="flex justify-center items-center w-10 h-10 outline-none"
            >
                {selectedChart === 0 ? (
                    <GrafIconActive />
                ) : (
                    <GrafIconDisabled />
                )}
            </IconButton>
            <IconButton
                isActive={selectedChart === 1}
                onClick={onDiagClick}
                className="flex justify-center items-center w-10 h-10  ml-10p"
            >
                {selectedChart === 1 ? (
                    <DiagIconActive />
                ) : (
                    <DiagIconDisabled />
                )}
            </IconButton>
        </section>
    );
};
