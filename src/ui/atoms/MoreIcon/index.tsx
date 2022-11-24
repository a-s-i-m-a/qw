import React, { forwardRef } from "react";

export interface MoreIconProps {
    circleColorClass: string;
    dotsColorClass: string;
    onClick: (event: React.MouseEvent<SVGSVGElement>) => void;
}
export const MoreIcon = forwardRef<SVGSVGElement, MoreIconProps>(
    ({ circleColorClass, dotsColorClass, onClick }, ref) => {
        return (
            <svg
                onClick={onClick}
                ref={ref}
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`cursor-pointer ${dotsColorClass}`}
            >
                <circle
                    cx="13"
                    cy="13"
                    r="13"
                    fill="currentColor"
                    className={circleColorClass}
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14 9C14 9.55228 13.5523 10 13 10C12.4477 10 12 9.55228 12 9C12 8.44772 12.4477 8 13 8C13.5523 8 14 8.44772 14 9ZM14 13C14 13.5523 13.5523 14 13 14C12.4477 14 12 13.5523 12 13C12 12.4477 12.4477 12 13 12C13.5523 12 14 12.4477 14 13ZM13 18C13.5523 18 14 17.5523 14 17C14 16.4477 13.5523 16 13 16C12.4477 16 12 16.4477 12 17C12 17.5523 12.4477 18 13 18Z"
                    fill="currentColor"
                    className='pointer-events-none'
                />
            </svg>
        );
    }
);
