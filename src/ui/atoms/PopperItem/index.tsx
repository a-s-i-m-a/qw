import { FC } from "react";

interface PopperItemProps {
    onClick: () => void;
}
export const PopperItem: FC<PopperItemProps> = ({ children, onClick }) => {
    return (
        <div
            className="flex text-12 py-2 px-5 cursor-pointer hover:text-purple-main"
            onClick={onClick}
        >
            {children}
        </div>
    );
};
