import { observer } from "mobx-react-lite";
import { FC, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Avatar } from "../../../../ui/atoms/Avatar";
import { WinePlaceholder } from "../../../../ui/atoms/illustration";
import { Price } from "../../../../ui/atoms/Price";
import { Table } from "../../../../ui/organisms/SimpleTable";
import { Column } from "../../../../ui/organisms/Table/types";
import { Items, Product } from "../../../types";
import { ordersStore } from "../../store/OrdersStore";
import { ChangeQuantity } from "../molecules/ChangeQuantity";

interface OrderedProductsProps {
    isEditing: boolean;
}

export const OrderedProducts: FC<OrderedProductsProps> = observer(
    ({ isEditing }) => {
        const { t } = useTranslation();
        const { order, total } = useContext(ordersStore);

        const columns: Column<Items<Product>>[] = useMemo(
            () => [
                {
                    Header: t("position") as string,
                    accessor: "product",
                    id: "product",
                    width: "2.25fr",
                    Cell: ({ cell, row }) => (
                        <>
                            <Avatar
                                key={row?.product?._id}
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
                            {t("orders.quantity")}
                        </span>
                    ),
                    accessor: "amount",
                    id: "amount",
                    width: "1fr",
                    Cell: ({ cell, row }) =>
                        isEditing ? (
                            <ChangeQuantity
                                name={`amount.${row?.product?._id}`}
                                id={row?.product?._id || ""}
                                quantity={cell}
                            />
                        ) : (
                            <span className="text-right flex-1">
                                {cell ?? "—"}
                            </span>
                        )
                },
                {
                    Header: (
                        <span className="text-right flex-1 mr-36p">
                            {t("orders.pricePerOne")}
                        </span>
                    ),
                    accessor: "product",
                    id: "price",
                    width: "1.3fr",
                    Cell: ({ cell }) => (
                        <Price
                            newPrice={cell?.newPrice ?? null}
                            price={cell?.price}
                            isAvailableForSale={true}
                            className="text-right flex-1 mr-36p"
                        />
                    )
                }
            ],
            [t, isEditing]
        );

        return (
            <section className="flex flex-col min-h-1/4 w-720p">
                <Table
                    data={order?.items ? order?.items : []}
                    isLoading={false}
                    pageCount={1}
                    columns={columns}
                    className="mt-50p"
                    sortedColumn={"name"}
                    id="order"
                    disablePagination={true}
                />
                <section className="flex flex-row w-720p justify-between mt-40p">
                    <p className="text-14 font-semibold text-dark-main">
                        {t("orders.delivery")}
                    </p>
                    <Price
                        newPrice={null}
                        price={order?.deliveryCost}
                        isAvailableForSale={true}
                        className="flex flex-col items-end mr-46p"
                    />
                </section>
                <section className="flex flex-row w-720p justify-between mt-25p items-end">
                    <p className="text-14 font-semibold text-dark-main">
                        {t("orders.total")}
                    </p>
                    <Price
                        newPrice={null}
                        price={isEditing ? total : order?.total}
                        isAvailableForSale={true}
                        className="flex flex-col items-end text-20 font-semibold text-dark-main mr-46p"
                    />
                </section>
            </section>
        );
    }
);
