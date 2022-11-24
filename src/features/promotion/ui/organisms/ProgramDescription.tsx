import { FC } from "react";
import { useTranslation } from "react-i18next";
import { ListIcon } from "../../../../ui/atoms/Icon";

interface ProgramDescriptionProps {
    className?: string;
}
export const ProgramDescription: FC<ProgramDescriptionProps> = ({
    className = ""
}) => {
    const { t } = useTranslation();
    return (
        <section className={`w-720p text-14 leading-5 ${className}`}>
            <p className="pr-10">{t("programDescription")}</p>
            <ul className="mt-30p">
                {new Array(5).fill("").map((_, index) => (
                    <li
                        key={`program-${index}`}
                        className="flex items-center mb-17p last:mb-0"
                    >
                        <ListIcon className="mr-18p" />
                        {t(`programFeature_${index}` as any)}
                    </li>
                ))}
            </ul>
        </section>
    );
};
