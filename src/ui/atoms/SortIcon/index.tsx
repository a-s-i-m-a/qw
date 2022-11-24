import { FC } from "react";

interface SortIconProps {
    sortIndex: number;
    className?: string;
}
export const SortIcon: FC<SortIconProps> = ({ sortIndex, className = "" }) => {
    return (
        <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M2.6 6.8L4.6 9.46667C4.8 9.73333 5.2 9.73333 5.4 9.46667L7.4 6.8C7.64721 6.47038 7.41202 6 7 6H3C2.58798 6 2.35279 6.47038 2.6 6.8Z"
                fill="currentColor"
                className={sortIndex > 0 ? "text-dark-main" : "text-gray-main"}
            />
            <path
                d="M2.6 3.2L4.6 0.533333C4.8 0.266667 5.2 0.266666 5.4 0.533333L7.4 3.2C7.64721 3.52962 7.41202 4 7 4H3C2.58798 4 2.35279 3.52962 2.6 3.2Z"
                fill="currentColor"
                className={sortIndex < 0 ? "text-dark-main" : "text-gray-main"}
            />
        </svg>
    );
};
