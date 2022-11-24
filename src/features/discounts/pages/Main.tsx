import { useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../ui/atoms/Button";
import { Search } from "../../../ui/atoms/Search";
import { Table } from "../../../ui/organisms/Table";
import { TabList } from "../../../ui/organisms/TabList";
import { Discounts } from "../../types";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useTableFetch } from "../../../ui/organisms/Table/useTableFetch";
import { authStore } from "../../auth/store/AuthStore";
import { discountsStore } from "../store/DiscountsStore";
import { ROUTE_LINK_DISCOUNTS } from "../routes";
import { DiscountsAPI } from "../../utils/api/requests/discounts-requests";
import { getColumns, getRetailerColumns } from "../consts";
import { Empty } from "../ui/organisms/Empty";
import useDebounce from "../../utils/hooks/useDebounce";

const getStatus = (tab: number) => {
    if (tab === 0) {
        return "accepted";
    }
    if (tab === 1) {
        return "pending";
    }
    return undefined;
};

export const Main = observer(() => {
    const { t } = useTranslation();
    const {
        search,
        handleSearch,
        activeTab,
        setTab,
        setEditing,
        setEmpty
    } = useContext(discountsStore);
    const debouncedSearch = useDebounce(search, 500);
    const { user } = useContext(authStore);
    const history = useHistory();
    const extraArgs = useMemo(
        () => ({
            status: getStatus(activeTab),
            role: user?.role === "retailer" ? "retailer" : "admin"
        }),
        [activeTab, user]
    );

    const columns = useMemo(
        () =>
            user?.role === "retailer" ? getRetailerColumns(t) : getColumns(t),
        [user, t]
    );

    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            handleSearch(event.target.value);
        },
        [handleSearch]
    );

    const handleCreateClick = () => {
        setEditing(true);
        history.push(`${ROUTE_LINK_DISCOUNTS}/create`);
    };

    const handleRowClick = useCallback(
        (data: Discounts) => {
            history.push(`${ROUTE_LINK_DISCOUNTS}/${data._id}`);
        },
        [history]
    );
    const fetchFn = useCallback(
        async args => {
            const data = await DiscountsAPI.getList({ ...args, ...extraArgs });
            if (!data.items.length) {
                setEmpty(true);
            }
            return data;
        },
        [extraArgs, setEmpty]
    );
    const { data, isLoading, pageCount, fetch } = useTableFetch<Discounts>({
        id: `discounts-${activeTab}`,
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
                {user?.role === "retailer" && (
                    <Button onClick={handleCreateClick} text={t("create")} />
                )}
            </section>
            <TabList
                className="px-50p"
                activeIndex={activeTab}
                onChange={setTab}
                options={[t("active.plural_1"), t("discounts.aproveAwaiting")]}
            />
            <Table
                data={data}
                isLoading={isLoading}
                pageCount={pageCount}
                fetch={fetch}
                columns={columns}
                className="px-50p mt-8"
                handleRowClick={handleRowClick}
                id={`discounts-${activeTab}`}
                CustomEmptyState={search ? undefined : () => <Empty />}
                sortedColumn="-createDate"
                search={debouncedSearch}
            />
        </>
    );
});
