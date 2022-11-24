import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "../../../../ui/atoms/SectionHeader";
import { Quiz, QuizProps } from "../../../../ui/organisms/Quiz";
import { Languages } from "../../../types";

interface QuizSectionProps {
    isEditing: boolean;
    className?: string;
}
export const QuizSection: FC<QuizSectionProps> = observer(({ isEditing, className }) => {
    const { t } = useTranslation();
    const language = useWatch({ name: "currentLang" });
    const quiz = useWatch({ name: "quiz" });
    const { unregister } = useFormContext();

    const QuizWithLang = useCallback(
        ({ isEditing }: Partial<QuizProps>) => (
            <Quiz
                className="mt-5"
                name="quiz"
                isEditing={isEditing}
                lang={language.value}
            />
        ),
        [language]
    );

    useEffect(() => {
        // for correct validation we should unregister empty fields
        quiz?.questions &&
            Object.entries(quiz.questions).forEach(questingWithLang => {
                const [lang, questions] = questingWithLang;
                if (lang === language.value) {
                    return;
                }
                Array.isArray(questions) &&
                    questions.length === 0 &&
                    unregister(`quiz.questions.${lang as Languages}`, {
                        keepError: true
                    });
            });
    }, [unregister, quiz?.questions, language?.value]);

    return (
        <section className={className}>
            <SectionHeader title={t("quiz")} />
            <QuizWithLang isEditing={isEditing} />
        </section>
    );
});
