import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { PageHeader } from "../../../../ui/molecules/PageHeader";
import { certificatesStore } from "../../store/CertificatesStore";
import { getBonusLessonTitle } from "../../utils/detailsHelper";
import { PoppedEditButtonBonusLesson } from "./PoppedEditButtonBonusLesson";

interface DetailsHeaderProps {
    isCreating: boolean;
}
export const BonusLessonHeader: FC<DetailsHeaderProps> = observer(
    ({ isCreating }) => {
        const { goBack } = useHistory();
        const { t } = useTranslation();
        const { isEditing, setEditing, level, bonusLesson } = useContext(
            certificatesStore
        );
        const { formState, reset } = useFormContext();
        const { isDirty } = formState;
        const handleCancel = async () => {
            if (isCreating) {
                goBack();
            } else {
                if (bonusLesson) {
                    reset({
                        ...bonusLesson,
                        sortNumber:
                            level?.bonusLessons &&
                            level?.bonusLessons.findIndex(
                                item => item._id === bonusLesson._id
                            ) + 1
                    });
                }
            }
            setEditing(false);
        };

        return (
            <PageHeader
                onBack={!isEditing ? goBack : undefined}
                title={getBonusLessonTitle(
                    bonusLesson,
                    isEditing,
                    !!isCreating,
                    t
                )}
            >
                {isEditing ? (
                    <>
                        <Button
                            text={t("cancel_1")}
                            type="secondary"
                            htmlType="button"
                            onClick={handleCancel}
                        />
                        <Button
                            htmlType="submit"
                            text={t("save")}
                            isDisabled={!isDirty}
                        />
                    </>
                ) : (
                    <PoppedEditButtonBonusLesson />
                )}
            </PageHeader>
        );
    }
);
