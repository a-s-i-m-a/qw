import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../../ui/atoms/Button";
import { promotionStore } from "../../../promotion/store/PromotionStore";
import { ProgramDescription } from "../../../promotion/ui/organisms/ProgramDescription";
import { catalogueStore } from "../../store/CatalogueStore";

export const Program = () => {
    const { t } = useTranslation();
    const { setForceProduct } = useContext(promotionStore);
    const { product } = useContext(catalogueStore);
    const history = useHistory();
    const requestPromo = () => {
        setForceProduct(product!);
        history.push("/promotion/create");
    };
    return (
        <>
            <h3 className="mb-30p text-30 font-normal">
                {t("qvinoMarketingProgram")}
            </h3>
            <ProgramDescription />
            <Button
                text={t("requestPromotion")}
                htmlType="button"
                className="mt-10"
                onClick={requestPromo}
            />
        </>
    );
};
