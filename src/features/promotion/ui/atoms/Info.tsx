import { FC } from "react";

interface InfoProps {
    label: string;
    value?: string | number | null;
}

export const Info: FC<InfoProps> = ({ label, value }) => {
    return (
        <section className="flex flex-col">
            <span className="text-14 font-bold text-gray-text mb-3">
                {label}
            </span>
            <span>{value ?? "—"}</span>
        </section>
    );
};
