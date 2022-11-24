import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { PageHeader } from "../../../../ui/molecules/PageHeader";
import { authStore } from "../../../auth/store/AuthStore";
import { videoStore } from "../../store/VideoStore";
import { getDetailsTitle } from "../../utils/getDetailsTitle";
import { transformVideo } from "../../utils/transformVideo";
import { PoppedEditButton } from "./PoppedEditButton";

interface DetailsHeaderProps {
    isCreating: boolean;
}
export const DetailsHeader: FC<DetailsHeaderProps> = observer(
    ({ isCreating }) => {
        const { reset } = useFormContext();
        const { user } = useContext(authStore);
        const { goBack } = useHistory();
        const { t } = useTranslation();
        const { isEditing, setEditing, video } = useContext(videoStore);

        const handleCancel = async () => {
            if (isCreating) {
                goBack();
            } else {
                reset(transformVideo(video!));
                setEditing(false);
            }
        };

        return (
            <PageHeader
                onBack={!isEditing ? goBack : undefined}
                title={getDetailsTitle(
                    video?.product ?? null,
                    isEditing,
                    !!isCreating,
                    t
                )}
                children={
                    user?.role !== "manufacturer" && (
                        <>
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
                                    />
                                </>
                            ) : (
                                <PoppedEditButton />
                            )}
                        </>
                    )
                }
            />
        );
    }
);
