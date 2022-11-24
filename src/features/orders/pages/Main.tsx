import { useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "../../../ui/atoms/Search";
import { Table } from "../../../ui/organisms/Table";
import { TabList } from "../../../ui/organisms/TabList";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useTableFetch } from "../../../ui/organisms/Table/useTableFetch";
import { authStore } from "../../auth/store/AuthStore";
import { ordersStore } from "../store/OrdersStore";
import { getColumns } from "../consts";
import { Languages, Order } from "../../types";
import { ROUTE_LINK_ORDERS } from "../routes";
import { OrdersAPI } from "../../utils/api/requests/order-request";
import { getSearchStatus } from "../utils/getStatus";
import { getListFields } from "../../fields/orders";
import { Checkbox } from "../../discounts/ui/atoms/Checkbox";
import useDebounce from "../../utils/hooks/useDebounce";

export const Main = observer(() => {
    const { t, i18n } = useTranslation();
    const {
        search,
        handleSearch,
        activeTab,
        setTab,
        qvinoSearch,
        setQvinoSearch
    } = useContext(ordersStore);
    const debouncedSearch = useDebounce(search, 500);
    const { user } = useContext(authStore);
    const history = useHistory();
    const extraArgs = useMemo(
        () => ({
            status: getSearchStatus(activeTab),
            role: user?.role === "manufacturer" ? "manufacturer" : "admin",
            _fields: getListFields(),
            isQvinoOrder: qvinoSearch
        }),
        [ activeTab, user?.role, qvinoSearch]
    );

    const columns = useMemo(() => {
        return getColumns(
            t,
            i18n.language as Languages,
            activeTab,
            user?.role
        ).filter(
            column => !column?.hasOwnProperty("isVisible") || column.isVisible
        );
    }, [activeTab, t, user?.role, i18n.language]);

    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            handleSearch(event.target.value);
        },
        [handleSearch]
    );

    const handleRowClick = useCallback(
        (data: Order<false>) => {
            history.push(`${ROUTE_LINK_ORDERS}/${data._id}`);
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
        id: `orders-${activeTab}`,
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
                {(user?.role === "admin" || user?.role === "owner") && (
                    <span className="flex flex-row items-center mr-50p">
                        <Checkbox
                            isChecked={qvinoSearch}
                            onClick={() => setQvinoSearch(!qvinoSearch)}
                        />
                        <p className="ml-4 text-14 text-dark-text">
                            {t("qvinosVinesOrders")}
                        </p>
                    </span>
                )}
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
                id={`orders-${activeTab}`}
                search={debouncedSearch}
            />
        </>
    );
});
