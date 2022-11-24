import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { PageHeader } from "../../../../ui/molecules/PageHeader";
import { reviewStore } from "../../store/ReviewStore";
import { getDetailsTitle } from "../../utils/getDetailsTitle";
import { transformReview } from "../../utils/transformReview";
// import { transformReview } from "../../utils/transformReview";
import { PoppedEditButton } from "./PoppedEditButton";

interface DetailsHeaderProps {
    isCreating: boolean;
}
export const DetailsHeader: FC<DetailsHeaderProps> = observer(
    ({ isCreating }) => {
        const { goBack } = useHistory();
        const { t } = useTranslation();
        const { isEditing, setEditing, review } = useContext(reviewStore);
        const { reset, formState } = useFormContext();
        const { isDirty } = formState;
        const handleCancel = async () => {
            if (isCreating) {
                goBack();
            } else {
                reset(transformReview(review!, review!.user));
                setEditing(false);
            }
        };

        return (
            <PageHeader
                onBack={!isEditing ? goBack : undefined}
                title={getDetailsTitle(
                    review!?.product,
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
                    <PoppedEditButton />
                )}
            </PageHeader>
        );
    }
);
