import { FC } from "react";

interface SectionHeaderProps {
    title: string;
}
export const SectionHeader: FC<SectionHeaderProps> = ({ title }) => {
    return <h4 className="font-semibold text-16 text-dark-main">{title}</h4>;
};
