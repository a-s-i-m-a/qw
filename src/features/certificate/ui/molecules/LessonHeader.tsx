import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { PageHeader } from "../../../../ui/molecules/PageHeader";
import { ROUTE_LINK_CERTIFICATES } from "../../routes";
import { certificatesStore } from "../../store/CertificatesStore";
import { getLessonTitle } from "../../utils/detailsHelper";
import { PoppedEditButtonLesson } from "./PoppedEditButtonLesson";

interface DetailsHeaderProps {
    isCreating: boolean;
}
export const LessonHeader: FC<DetailsHeaderProps> = observer(
    ({ isCreating }) => {
        const history = useHistory();
        const { t } = useTranslation();
        const { isEditing, setEditing, lesson, level } = useContext(
            certificatesStore
        );
        const { formState, reset } = useFormContext();
        const { isDirty } = formState;
        const goBack = () => {
            history.replace(`${ROUTE_LINK_CERTIFICATES}/level/${level?._id}`);
        };

        const handleCancel = async () => {
            if (isCreating) {
                goBack();
            } else {
                if (lesson) {
                    reset({ ...lesson, sortNumber: lesson?.sortNumber + 1 });
                }
            }
            setEditing(false);
        };

        return (
            <PageHeader
                onBack={!isEditing ? goBack : undefined}
                title={getLessonTitle(lesson, isEditing, !!isCreating, t)}
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
                    <PoppedEditButtonLesson />
                )}
            </PageHeader>
        );
    }
);
