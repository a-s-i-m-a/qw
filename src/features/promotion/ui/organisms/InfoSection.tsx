import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Avatar } from "../../../../ui/atoms/Avatar";
import { WinePlaceholder } from "../../../../ui/atoms/illustration";
import { PageSpinner } from "../../../../ui/atoms/PageSpinner";
import { Product } from "../../../types";
import { formatThousands } from "../../../utils/formatNumber";
import { getSuffix } from "../../../utils/getSuffix";
import { Info } from "../atoms/Info";

interface InfoSectionProps {
    product?: Product;
    isLoading?: boolean;
    role?: "expert" | "admin";
}
export const InfoSection: FC<InfoSectionProps> = observer(
    ({ product, isLoading, role = "admin" }) => {
        const { t } = useTranslation();

        return (
            <section className="flex w-full relative">
                <Avatar
                    Placeholder={WinePlaceholder}
                    alt={product?.name ?? "Product avatar"}
                    isCircle={false}
                    size="lg"
                    photoUrl={product?.photo?.url}
                />
                <ul className="w-540p ml-10 grid grid-cols-2 auto-rows-min auto-cols-min content-between">
                    <Info
                        label={t("manufacturer.plural_0")}
                        value={product?.manufacturer?.name}
                    />
                    <Info
                        label={t("manufacturerCountry")}
                        value={product?.manufacturer?.country?.name}
                    />
                    {role === "admin" && (
                        <>
                            <Info
                                label={t("price2")}
                                value={
                                    product
                                        ? `${formatThousands(
                                              product.price?.value / 100
                                          )} ${getSuffix(
                                              product.price?.currency
                                          )}`
                                        : undefined
                                }
                            />

                            <Info
                                label={t("purchaseBonus")}
                                value={product?.bonusPoints}
                            />
                        </>
                    )}
                    {role === "expert" && (
                        <>
                            <Info label={t("year")} value={product?.vintage} />

                            <Info
                                label={t("region.plural_0")}
                                value={product?.region?.name}
                            />
                        </>
                    )}
                </ul>
                {isLoading && (
                    <div className="absolute -inset-2 bg-gray-main bg-opacity-30 rounded-20p">
                        <PageSpinner />
                    </div>
                )}
            </section>
        );
    }
);
