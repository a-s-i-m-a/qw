import React from "react";
import { useTranslation } from "react-i18next";

export const Header = () => {
    const { t } = useTranslation();
    return (
        <div className="sticky block z-20 top-0 text-gray-text font-semibold text-14 leading-4 py-14p px-10p bg-gray-bg first:pl-5 rounded-2xl">
            <span className="flex items-center flex-1 whitespace-nowrap">
                <span className="w-46p"></span>
                <span className="w-50p">{t("certificate.number")}</span>
                <span className="w-full">{t("certificate.blockName")}</span>
                <span className="w-46p"></span>
            </span>
        </div>
    );
};
