import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { PageHeader } from "../../../../ui/molecules/PageHeader";
import { articlesStore } from "../../store/ArticlesStore";
import { getDetailsTitle } from "../../utils/getDetailsTitle";
import { transformArticles } from "../../utils/transformArticles";
import { PoppedEditButton } from "./PoppedEditButton";

interface DetailsHeaderProps {
    isCreating: boolean;
}
export const DetailsHeader: FC<DetailsHeaderProps> = observer(
    ({ isCreating }) => {
        const { goBack } = useHistory();
        const { t } = useTranslation();
        const history = useHistory();
        const { isEditing, setEditing, article } = useContext(articlesStore);
        const { formState, reset } = useFormContext();
        const { isDirty } = formState;
        const handleCancel = async () => {
            if (isCreating) {
                goBack();
            } else {
                if (article) {
                    reset(transformArticles(article));
                }
                setEditing(false);
            }
        };
        const handleBack = () => {
            if (!isCreating) {
                history.push(`/promotion`)
            } else if(isEditing) {
                goBack()
            }
            return undefined
        };

        return (
            <PageHeader
                onBack={handleBack}
                title={getDetailsTitle(
                    article!?.manufacturer,
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
