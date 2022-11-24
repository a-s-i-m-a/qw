import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Price } from '../../../../ui/atoms/Price';
import { Search } from '../../../../ui/atoms/Search';
import { Table } from '../../../../ui/organisms/Table';
import { Column } from '../../../../ui/organisms/Table/types';
import { useTableFetch } from '../../../../ui/organisms/Table/useTableFetch';
import { TabList } from '../../../../ui/organisms/TabList';
import { getSafariFriendlyDate } from '../../../catalogue/utils/getSafariFriendlyDate';
import { getListFields } from '../../../fields/orders';
import { ROUTE_LINK_GIFT_ORDERS } from '../../../giftOrders/routes';
import { ROUTE_LINK_ORDERS } from '../../../orders/routes';
import { Order } from '../../../types';
import { OrdersAPI } from '../../../utils/api/requests/order-request';
import useDebounce from '../../../utils/hooks/useDebounce';
import { userStore } from '../../store/UserStore';
import { PoppedMoreIcon } from '../molecules/PoppedMoreIconOrders';

export const OrdersSection = observer(() => {
    const { t } = useTranslation();
    const { id } = useParams<Record<"id", string>>();
    const { setShouldClearSearch, setOrderTab, orderTab } = useContext(userStore);
    const history = useHistory();
    const onTabChange = (index: number) => {
        setOrderTab(index);
    };
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const extraArgs = useMemo(
        () => ({
            userId: id,
            type: orderTab === 0 ? "product" : "bonusProduct",
            role: "admin",
            _fields: getListFields()        
        }),
        [orderTab, id]
    );
    const columns: Column<Order<false>>[] = useMemo(
        () => [
            {
                Header: t("orders.orderNumber") as string,
                accessor: "number",
                id: "number",
                width: "1fr",
                Cell: ({ cell }) => cell ?? "—"
            },
            {
                Header: t("createDate") as string,
                accessor: "createDate",
                canSort: true,
                width: orderTab === 0 ? "1.4fr" : "1fr",
                Cell: ({ cell }) => (
                    <span>
                        {cell
                            ? getSafariFriendlyDate(cell).format("DD.MM.YYYY HH:mm")
                            : "—"}
                    </span>
                )
            },
            {
                Header: t("manufacturer.plural_0") as string,
                accessor: "manufacturer",
                width: "1.1fr",
                canSort: true,
                Cell: ({ cell }) => (
                    <span className="truncate">{cell?.name ?? "—"}</span>
                    ),
                isVisible: orderTab === 0
            },
            {
                Header: t("orders.deliveryCountry") as string,
                accessor: "deliveryAddress",
                id: "deliveryAddress.country",
                width: orderTab === 0 ? "1.1fr" : "1fr",
                Cell: ({ cell }) => (<span className="truncate">{cell?.country?.name ?? "—"}</span>)
            },
            {
                Header: <span className="text-right flex-1">{t("orders.quantity")}</span>,
                accessor: "items",
                id: "items",
                width: "1fr",
                Cell: ({ cell }) => (
                    <span className="text-right flex-1">{cell?.length ?? "—"}</span>
                ),
                isVisible: orderTab === 0
            },
            {
                Header: <span className="text-right flex-1">{t("orders.total")}</span>,
                accessor: "total",
                width: "1.5fr",
                Cell: ({ cell, row }) => (
                    <Price
                        newPrice={null}
                        price={cell}
                        isAvailableForSale={true}
                    />
                ),
                isVisible: orderTab === 0
            },
            {
                Header: <span className="text-right flex-1">{t("status")}</span>,
                accessor: "status",
                id: "status",
                width: orderTab === 0 ? "1.5fr" : "1fr",
                Cell: ({ cell }) => <span className="text-right flex-1">{t(`orders.status.${cell}`)}</span>
            },
            {
                accessor: "_id",
                width: 46,
                Cell: ({ row }) => (
                    <PoppedMoreIcon status={row.status} item={row}/>
                )
            }
        ],
        [orderTab, t]
    );
    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
        },
        [setSearch]
    );
    useEffect(() => {
        return () => {
            setShouldClearSearch(true);
        };
    })
    const handleRowClick = useCallback(
        (data: Order<false>) => {
            setShouldClearSearch(false);
            if (orderTab === 0) {
                setOrderTab(0);
                history.push(`${ROUTE_LINK_ORDERS}/${data._id}`, {from: history.location.pathname} as {from: string});
            } 
            if (orderTab === 1) {
                setOrderTab(1)
                history.push(`${ROUTE_LINK_GIFT_ORDERS}/${data._id}`, {from: history.location.pathname} as {from: string});
            } 
        },
        [setShouldClearSearch, orderTab, history, setOrderTab]
    );
    const fetchFn = useCallback(
        async args => {
            const data = await OrdersAPI.getList({ ...args, ...extraArgs });
            return data;
        },
        [extraArgs]
    );
    const { data, isLoading, pageCount, fetch } = useTableFetch<Order<false>>({
        id: `orders-${orderTab}-${id}`,
        fetchFn
    });
    return (
        <>
            <section className="flex flex-row justify-between mx-50p">
                <TabList
                    className="mb-30p"
                    activeIndex={orderTab}
                    onChange={onTabChange}
                    options={[
                        t("userOrders"),
                        t("orders.giftOrdersTab"),
                        t("scannings")
                    ]}
                />
                {orderTab < 2 && 
                <Search
                    className="w-300p"
                    value={search}
                    onChange={handleSearchChange}
                />}
            </section>
            {orderTab < 2 && 
            <Table
                className="mx-50p"
                data={data}
                isLoading={isLoading}
                pageCount={pageCount}
                fetch={fetch}
                columns={columns.filter(
                    column => !column?.hasOwnProperty("isVisible") || column.isVisible
                )}
                handleRowClick={handleRowClick}
                id={`orders-${orderTab}`}
                sortedColumn="-createDate"
                search={debouncedSearch}
            />}
        </>
    );
});