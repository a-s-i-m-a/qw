import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../../ui/atoms/Button";

interface SuccessRestoreProps {
    login: string;
}
export const SuccessRestore: FC<SuccessRestoreProps> = ({ login }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const goBack = () => {
        history.push("/login", {
            login
        });
    };
    return (
        <section className="w-300p mt-48">
            <h2 className="font-semibold text-18 mb-5">{t("resetSuccess")}</h2>
            <span className="text-14 leading-5">
                {t("checkEmailAfterReset")}
            </span>
            <Button
                className="mt-10"
                isFull={true}
                text={t("goBack")}
                onClick={goBack}
            />
        </section>
    );
};
