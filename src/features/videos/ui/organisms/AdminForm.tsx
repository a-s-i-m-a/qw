import { observer } from "mobx-react-lite";
import { useEffect, useContext } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import {
    langTabs,
    LanguageTabChanger
} from "../../../../ui/organisms/LanguageTabChanger";
import { WineSelectingSection } from "../../../promotion/ui/organisms/WineSelectingSection";
import { Languages } from "../../../types";
import { videoStore } from "../../store/VideoStore";
import { QuizSection } from "./QuizSection";
import { UserDetails } from "./UserDetails";
import { VideoDetails } from "./VideoDetails";

export const AdminForm = observer(() => {
    const { isEditing } = useContext(videoStore);

    const values = useWatch({ name: ["links", "quiz", "currentLang"] });
    const { isSubmitted, isValid, errors } = useFormState();
    const { setValue, clearErrors } = useFormContext();
    useEffect(() => {
        //tab switcher
        if (isSubmitted && !isValid) {
            const currentLang = values[2].value;
            const linksError = errors?.["links"] ?? {};
            const quizError = errors?.["quiz"] ?? {};
            const linksErrorLangs = Object.keys(linksError) as Languages[];
            const quizErrorLangs = Object.keys(
                quizError?.questions ?? {}
            ) as Languages[];

            let switchLang = currentLang as Languages;

            if (!linksErrorLangs.includes(currentLang)) {
                linksErrorLangs.forEach(lang => {
                    if (lang !== currentLang) {
                        switchLang = lang;
                    }
                });
            }
            if (!quizErrorLangs.includes(currentLang)) {
                quizErrorLangs.forEach(lang => {
                    if (lang !== currentLang) {
                        switchLang = lang;
                    }
                });
            }

            if (
                switchLang !== currentLang &&
                (values[1].questions?.[switchLang]?.length !== 0 ||
                    values[0][switchLang] !== "")
            ) {
                setValue(
                    "currentLang",
                    langTabs.find(lang => lang.value === switchLang)!
                );

                clearErrors();
            }
        }
    }, [clearErrors, errors, isSubmitted, isValid, setValue, values]);

    return (
        <section className="w-720p grid gap-y-50p">
            <UserDetails isEditing={isEditing} />
            {isEditing && <WineSelectingSection isEditing={isEditing} />}
            <LanguageTabChanger name="currentLang" />
            <VideoDetails isEditing={isEditing} />
            <QuizSection isEditing={isEditing} />
        </section>
    );
});
