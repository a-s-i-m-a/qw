import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Answer, Languages } from "../../../features/types";
import { FormInput } from "../../atoms/FormInput";
import { FormRadio } from "../../atoms/FormRadio";
import { TrashIcon } from "../../atoms/Icon";
import cn from "classnames";

interface AnswersProps {
    questionIndex: number;
    name: string;
    isEditing?: boolean;
    lang: Languages;
}

export const Answers: FC<AnswersProps> = ({
    name,
    questionIndex,
    isEditing,
    lang
}) => {
    const { t } = useTranslation();
    const { setValue, getValues, control, register } = useFormContext();
    const { ref, ...rest} = register(`${name}.questions.${lang}.${questionIndex}.correctAnswer`)
    const { fields, append, remove } = useFieldArray({
        name: `${name}.questions.${lang}.${questionIndex}.answers`,
        control
    });
    const addNewOneAnswer = () => {
        append({ text: "", isCorrect: false });
    };

    const correctAnswer = useWatch({name: `${name}.questions.${lang}.${questionIndex}.correctAnswer`});

    useEffect(() => {
        // effect make check of equaling of internal value "correctAnswer" and index

        // not fields from hook because fields changes after the moment we should iterate over it
        const fields = getValues(
            `${name}.questions.${lang}.${questionIndex}.answers`
        ) as Answer[];

        correctAnswer &&
            fields.forEach((item, index) => {
                // iterate only for changed items
                if (index.toString() === correctAnswer || item.isCorrect) {
                    setValue(
                        `${name}.questions.${lang}.${questionIndex}.answers.${index}`,
                        {
                            ...item,
                            isCorrect:
                                correctAnswer.toString() === index.toString()
                        }
                    );
                }
            });
    }, [correctAnswer, getValues, lang, name, questionIndex, setValue]);

    const handleRemoveAnswer = (index: number) => {
        const curValue = getValues(
            `${name}.questions.${lang}.${questionIndex}.answers.${index}`
        ) as Answer;

        if (curValue.isCorrect) {
            setValue(
                `${name}.questions.${lang}.${questionIndex}.correctAnswer`,
                String(Number(correctAnswer) - 1)
            );
        }
        remove(index);
    };

    const itemClasses = cn(
        "flex items-center relative pr-10 mb-10p last:mb-0",
        {
            "h-42p": !isEditing
        }
    );
    return (
        <>
            {fields.length > 0 && (
                <ul className="mt-5 transition-all">
                    <AnimatePresence>
                        {fields?.map((field, answerIndex) => (
                            <motion.li
                                key={field.id}
                                initial={
                                    isEditing && {
                                        opacity: 0,
                                        y: -50,
                                        scale: 0.3
                                    }
                                }
                                animate={
                                    isEditing && {
                                        opacity: 1,
                                        y: 0,
                                        scale: 1
                                    }
                                }
                                className={itemClasses}
                            >
                                <div className="flex items-center justify-center w-42p">
                                    <FormRadio
                                        {...rest}
                                        isEditing={isEditing}
                                        name={`${name}.questions.${lang}.${questionIndex}.correctAnswer`}
                                        value={answerIndex.toString()}
                                    />
                                </div>
                                <FormInput
                                    name={`${name}.questions.${lang}.${questionIndex}.answers.${answerIndex}.text`}
                                    hideLabel={true}
                                    className="flex-1"
                                    isEditing={isEditing}
                                    maxLength={50}
                                />
                                {isEditing && answerIndex > 1 && (
                                    <TrashIcon
                                        className="cursor-pointer m-10p absolute right-0 top-0 bottom-0"
                                        onClick={() =>
                                            handleRemoveAnswer(answerIndex)
                                        }
                                    />
                                )}
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            )}
            {isEditing && (
                <button
                    className={`outline-none text-14 text-purple-main font-semibold ml-42p mt-8 transition-all`}
                    onClick={addNewOneAnswer}
                    type="button"
                >
                    {`+ ${t(`new`, {
                        word: t("answer").toLowerCase()
                    })}`}
                </button>
            )}
        </>
    );
};
