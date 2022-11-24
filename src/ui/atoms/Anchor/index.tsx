import { FC } from "react";
import { Link, LinkProps } from "react-router-dom";

export const Anchor: FC<LinkProps> = ({ to, className = "", children }) => (
    <Link
        className={`outline-none text-14 text-purple-main font-semibold ${className}`}
        to={to}
    >
        {children}
    </Link>
);
