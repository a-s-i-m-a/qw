import { FC, ReactNode } from "react";
import { BackButton } from "../BackButton";
import cn from "classnames";

interface PageHeaderProps {
    title?: string;
    onBack?: () => void;
    afterTitle?: ReactNode;
    className?: string;
}
export const PageHeader: FC<PageHeaderProps> = ({
    title,
    children,
    onBack,
    afterTitle,
    className
}) => {
    const headerClasses = cn(
        "flex items-center mb-50p flex-shrink-0",
        className
    );
    return (
        <header className={headerClasses}>
            {onBack && (
                <BackButton onClick={onBack} className="mr-5 print:hidden" />
            )}
            {title && (
                <h2 className="text-30 text-dark-main truncate max-w-half">
                    {title}
                </h2>
            )}
            {afterTitle}
            <section className="grid grid-flow-col gap-5 ml-5 absolute right-50p top-50p">
                {children}
            </section>
        </header>
    );
};
