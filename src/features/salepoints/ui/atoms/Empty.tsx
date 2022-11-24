import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { ROUTE_LINK_SALEPOINTS } from "../../routes";
import { salepointsStore } from "../../store/SalepointsStore";

export const Empty = () => {
    const { t } = useTranslation();
    const { setEditing } = useContext(salepointsStore);
    const history = useHistory();
    const handleCreateClick = () => {
        setEditing(true);
        history.push(`${ROUTE_LINK_SALEPOINTS}/create`);
    };
    return (
        <>
            <section className="flex justify-end mb-8 px-50p">
                <Button onClick={handleCreateClick} text={t("create")} />
            </section>
            <section className="w-full h-full flex flex-col justify-center items-center text-18 text-gray-text mb-20">
                <p>{t("salepoints.emptyDescription1")}</p>
                <p>{t("salepoints.emptyDescription2")}</p>
            </section>
        </>
    );
};
