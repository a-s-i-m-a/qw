import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { PageHeader } from "../../../../ui/molecules/PageHeader";
import { userStore } from "../../store/UserStore";
import { getDetailsTitle } from "../../utils/getDetailsTitle";
import { transformUser } from "../../utils/transformUser";
import { Status } from "../atoms/Status";
import { PoppedEditButton } from "./PoppedEditButton";

export const DetailsHeader = () => {
    const { reset } = useFormContext();
    const isCreating = useRouteMatch("/user/create");
    const { id } = useParams<Record<"id", string>>();

    const history = useHistory();
    const { t } = useTranslation();
    const { disableUserEditing, isUserEditing, user, setOrderTab } = useContext(userStore);

    const goToTable = () => {
        setOrderTab(0)
        history.push("/users");
    };

    const handleCancel = async () => {
        if (isCreating) {
            goToTable();
        } else {
            reset(transformUser(user!));
            disableUserEditing();
        }
    };
    return (
        <PageHeader
            afterTitle={
                user?._id && (
                    <Status
                        status={user.isBlocked ? "black" : "success"}
                        className="ml-5"
                        text={
                            user.isBlocked
                                ? t("blocked.plural_0")
                                : t("active.plural_0")
                        }
                    />
                )
            }
            onBack={!isUserEditing && id ? goToTable : undefined}
            title={getDetailsTitle(user!, isUserEditing, !!isCreating, t)}
        >
            {isUserEditing ? (
                <>
                    <Button
                        text={t("cancel_1")}
                        type="secondary"
                        htmlType="button"
                        onClick={handleCancel}
                    />
                    <Button
                        // isDisabled={!isDirty || !isValid}
                        htmlType="submit"
                        text={t("save")}
                    />
                </>
            ) : (
                <PoppedEditButton />
            )}
        </PageHeader>
    );
};
