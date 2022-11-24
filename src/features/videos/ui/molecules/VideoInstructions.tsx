import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { authStore } from "../../../auth/store/AuthStore";

export const VideoInstructions = observer(() => {
    const { t } = useTranslation();
    const { user } = useContext(authStore);
    return (
        <ol className="list-decimal list-inside text-14 leading-5">
            {user?.role === "expert" ? (
                <>
                    <li>{t("videoStepForExpert1")}</li>
                    <li>{t("videoStepForExpert2")}</li>
                    <li>{t("videoStepForExpert3")}</li>
                </>
            ) : (
                <>
                    <li>{t("videoStepForAdmin1")}</li>
                    <li>{t("videoStepForAdmin2")}</li>
                    <li>{t("videoStepForAdmin3")}</li>
                </>
            )}
        </ol>
    );
});
