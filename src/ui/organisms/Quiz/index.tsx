import { FC } from "react";
import cn from "classnames";
import { useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Languages } from "../../../features/types";
import { useTranslation } from "react-i18next";
import { Question } from "./Question";
import { useFormState } from "react-hook-form";
import { useMemo } from "react";

export interface QuizProps {
    className?: string;
    name: string;
    isEditing?: boolean;
    lang: Languages;
}

export const Quiz: FC<QuizProps> = ({
    className = "",
    name,
    isEditing = true,
    lang
}) => {
    const context = useFormContext();
    if (!context) {
        throw new Error("Provide FormContext before Quiz");
    }
    const { control } = context;
    const { t } = useTranslation();
    const { errors } = useFormState({ name: `${name}.questions` });
    const { fields, append, remove } = useFieldArray({
        control,
        name: `${name}.questions.${lang}`
    });

    const wrapperClasses = cn("flex flex-col", className);

    const addNewOneQuestion = () => {
        append({
            question: "",
            answers: [
                {
                    text: "",
                    isCorrect: true
                },
                {
                    text: "",
                    isCorrect: false
                }
            ],
            correctAnswer: "0"
        });
    };

    const isError = useMemo(
        () =>
            (fields.length === 0 && errors[name]) ||
            (fields.length === 0 &&
                errors[name]?.questions &&
                !!errors[name]?.questions[lang]),
        [errors, fields.length, lang, name]
    );

    const buttonClasses = cn(
        "p-30p rounded-20p border-gray-bg border-2 mb-30p last:mb-0 shadow-none outline-none font-semibold text-gray-main text-left focus:outline-none",
        {
            "border border-danger": isError,
            "border-gray-bg": !isError
        }
    );
    return (
        <section className={wrapperClasses}>
            {fields.length > 0 && (
                <ul className="mb-5">
                    {fields?.map((field, index) => (
                        <Question
                            key={field.id}
                            remove={remove}
                            index={index}
                            name={name}
                            isEditing={isEditing}
                            lang={lang}
                        />
                    ))}
                </ul>
            )}
            {isEditing && (
                <button
                    type="button"
                    onClick={addNewOneQuestion}
                    className={buttonClasses}
                >
                    {`+ ${t(`new`, {
                        word: t("question").toLowerCase()
                    })}`}
                </button>
            )}
        </section>
    );
};
