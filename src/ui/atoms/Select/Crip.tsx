import { FC } from "react";

interface CripProps {
    title: string;
}
export const Crip: FC<CripProps> = ({ title }) => (
    <div className="py-5p px-10p rounded-3xl bg-gray-text text-white mr-10p last:mr-0">
        {title}
    </div>
);
