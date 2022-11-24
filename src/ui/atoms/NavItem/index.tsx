import { useEffect } from "react";
import { FC, FunctionComponent, SVGProps } from "react";
import { NavLink, Route } from "react-router-dom";
import { Role } from "../../../features/types";
import { clearTableCache } from "../../organisms/Table/useTableStateSaver";

interface NavItemProps {
    Icon: FunctionComponent<
        SVGProps<SVGSVGElement> & { title?: string | undefined }
    >;
    label: string;
    to: string;
    pattern?: RegExp;
    roles?: Role[];
    userRole: Role;
    onLeave?: VoidFunction;
}

const OnLeaveTrigger: FC<{ onLeave: VoidFunction }> = ({ onLeave }) => {
    useEffect(() => {
        return () => {
            onLeave();
            clearTableCache();
        };
    }, [onLeave]);
    return null;
};

export const NavItem: FC<NavItemProps> = ({
    to,
    label,
    Icon,
    pattern,
    roles,
    userRole,
    onLeave
}) => {
    if (roles && !roles.includes(userRole)) {
        return null;
    }
    return (
        <li className="mb-6 last:mb-0">
            <NavLink
                to={to}
                className="group flex items-center transition-colors duration-150"
                isActive={
                    pattern
                        ? (_, { pathname }) => {
                              return pattern.test(pathname);
                          }
                        : undefined
                }
            >
                <Route
                    path={to}
                    children={({ match, location }) => {
                        const isActive = pattern
                            ? pattern.test(location.pathname)
                            : match;
                        return (
                            <>
                                <Icon
                                    className={`mr-4 flex-shrink-0 ${
                                        isActive
                                            ? "text-purple-main"
                                            : "text-gray-main"
                                    } `}
                                />
                                <span
                                    className={`text-base ${
                                        isActive
                                            ? "text-dark-main font-semibold"
                                            : "text-gray-text"
                                    }`}
                                >
                                    {label}
                                    {onLeave && isActive && (
                                        <OnLeaveTrigger onLeave={onLeave} />
                                    )}
                                </span>
                            </>
                        );
                    }}
                />
            </NavLink>
        </li>
    );
};
