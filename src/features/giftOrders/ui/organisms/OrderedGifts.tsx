import { observer } from "mobx-react-lite";
import { FC, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Avatar } from "../../../../ui/atoms/Avatar";
import { WinePlaceholder } from "../../../../ui/atoms/illustration";
import { Price } from "../../../../ui/atoms/Price";
import { Table } from "../../../../ui/organisms/SimpleTable";
import { Column } from "../../../../ui/organisms/Table/types";
import { BonusItems, Gift } from "../../../types";
import { giftOrdersStore } from "../../store/GiftOrdersStore";

interface OrderedProductsProps {
    isEditing: boolean;
}

export const OrderedGifts: FC<OrderedProductsProps> = observer(
    ({ isEditing }) => {
        const { t } = useTranslation();
        const { order } = useContext(giftOrdersStore);

        const columns: Column<BonusItems<Gift<false>>>[] = useMemo(
            () => [
                {
                    Header: t("position") as string,
                    accessor: "bonusProduct",
                    id: "product",
                    width: "3.2fr",
                    Cell: ({ cell, row }) => (
                        <>
                            <Avatar
                                key={row?.bonusProduct?._id}
                                size="xs"
                                Placeholder={WinePlaceholder}
                                alt={cell?.name}
                                photoUrl={cell?.photo?.url}
                                objectFit="contain"
                            />

                            <span className="ml-4 truncate">
                                {cell?.name || "—"}
                            </span>
                        </>
                    )
                },
                {
                    Header: (
                        <span className="text-right flex-1">
                            {t("orders.amountPoints")}
                       </span>
                    ), 
                    accessor: "bonusProduct",
                    id: "price",
                    width: "1fr",
                    Cell: ({ cell }) => (
                        <Price
                            price={cell?.price}
                            isAvailableForSale={true}
                            className="text-right flex-1"
                        />
                    )
                },
                {
                    accessor: "bonusProductId",
                    width: 46,
                }
            ],
            [t]
        );

        return (
            <section className="flex flex-col min-h-1/4 w-720p">
                    <Table
                        data={order?.bonusProductItems ? order?.bonusProductItems : []}
                        isLoading={false}
                        pageCount={1}
                        columns={columns as Column}
                        className="mt-50p"
                        id="order"
                        disablePagination={true}
                    />
            </section>
        );
    }
);
