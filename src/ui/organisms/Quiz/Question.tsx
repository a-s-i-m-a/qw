import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "../../../features/types";
import { FormTextarea } from "../../atoms/FormTextarea";
import { TrashIcon } from "../../atoms/Icon";
import { Answers } from "./Answers";

export interface QuestionProps {
    index: number;
    name: string;
    remove: (index: number) => void;
    isEditing?: boolean;
    lang: Languages;
}

export const Question: FC<QuestionProps> = ({
    index,
    name,
    remove: removeQuestion,
    isEditing,
    lang
}) => {
    const { t } = useTranslation();

    return (
        <li className="p-30p rounded-20p border-gray-bg border-2 mb-30p last:mb-0">
            <section className="flex justify-between">
                <h4 className="font-semibold text-16 text-dark-main">
                    {t("question")} {index + 1}
                </h4>
                {isEditing && (
                    <TrashIcon
                        className="cursor-pointer"
                        onClick={() => removeQuestion(index)}
                    />
                )}
            </section>
            <FormTextarea
                className="mt-5"
                hideLabel={true}
                name={`${name}.questions.${lang}.${index}.question`}
                placeholder={t("typeQuestion")}
                textareaClasses="resize-none h-84p"
                isEditing={isEditing}
                maxLength={200}
            />
            <Answers
                name={name}
                questionIndex={index}
                isEditing={isEditing}
                lang={lang}
            />
        </li>
    );
};
