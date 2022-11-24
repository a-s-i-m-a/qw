import { TFunction } from "react-i18next";

export const getStateLabel = ( t: TFunction, iso?: string) => {
    if (iso === "CA") {
        return t("orders.province");
    }
    return t("orders.state");;
};
