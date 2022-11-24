import { useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "../../../ui/atoms/Search";
import { Table } from "../../../ui/organisms/Table";
import { TabList } from "../../../ui/organisms/TabList";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useTableFetch } from "../../../ui/organisms/Table/useTableFetch";
import { giftOrdersStore } from "../store/GiftOrdersStore";
import { getColumns } from "../consts";
import { Languages, Order } from "../../types";
import { ROUTE_LINK_GIFT_ORDERS } from "../routes";
import { OrdersAPI } from "../../utils/api/requests/order-request";
import { getSearchStatus } from "../../orders/utils/getStatus";
import useDebounce from "../../utils/hooks/useDebounce";
import { getGiftOrdersListFields } from "../../fields/giftOrders";

export const Main = observer(() => {
    const { t, i18n } = useTranslation();
    const { search, handleSearch, activeTab, setTab } = useContext(giftOrdersStore);
    const history = useHistory();
    const debouncedSearch = useDebounce(search, 500);
    const extraArgs = useMemo(
        () => ({
            type: "bonusProduct",
            status: getSearchStatus(activeTab),
            role: "admin",
            _fields: getGiftOrdersListFields()
        }),
        [activeTab]
    );

    const columns = useMemo(() => {
        return getColumns(t, i18n.language as Languages, activeTab)
        .filter(column => !column?.hasOwnProperty("isVisible") || column.isVisible);
    }, [activeTab, t, i18n.language]);
    
    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            handleSearch(event.target.value);
        },
        [handleSearch]
    );

    const handleRowClick = useCallback(
        (data: Order<false>) => {
            history.push(`${ROUTE_LINK_GIFT_ORDERS}/${data._id}`);
        },
        [history]
    );
    const fetchFn = useCallback(
        async args => {
            const data = await OrdersAPI.getList({ ...args, ...extraArgs });
            return data;
        },
        [extraArgs]
    );
    const { data, isLoading, pageCount, fetch } = useTableFetch<Order<false>>({
        id: `gift-orders-${activeTab}`,
        fetchFn
    });

    return (
        <>
            <section className="flex justify-between mb-8 px-50p">
                <Search
                    className="w-300p"
                    value={search}
                    onChange={handleSearchChange}
                />
            </section>
            <section className="flex flex-row justify-between">
                <TabList
                    className="px-50p"
                    activeIndex={activeTab}
                    onChange={setTab}
                    options={[
                        t("orders.tabsNew"),
                        t("orders.tabsProcessing"),
                        t("orders.tabsSended"),
                        t("orders.tabsDelivered"),
                        t("orders.tabsCanceled")
                    ]}
                />
            </section>
            <Table
                data={data}
                isLoading={isLoading}
                pageCount={pageCount}
                fetch={fetch}
                columns={columns}
                className="px-50p mt-8"
                handleRowClick={handleRowClick}
                sortedColumn="-createDate"
                id={`gift-orders-${activeTab}`}
                search={debouncedSearch}
            />
        </>
    );
});
