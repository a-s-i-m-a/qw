import { useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../ui/atoms/Button";
import { Search } from "../../../ui/atoms/Search";
import { Table } from "../../../ui/organisms/Table";
import { TabList } from "../../../ui/organisms/TabList";
import { Product, Role } from "../../types";
import { CatalogueAPI } from "../../utils/api/requests/catalogue-requests";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Avatar } from "../../../ui/atoms/Avatar";
import { WinePlaceholder } from "../../../ui/atoms/illustration";
import { PoppedMoreIcon } from "../ui/molecules/PoppedMoreIcon";
import { Column } from "../../../ui/organisms/Table/types";
import { catalogueStore } from "../store/CatalogueStore";
import { useTableFetch } from "../../../ui/organisms/Table/useTableFetch";
import { TFunction } from "i18next";
import { ROUTE_LINK_CATALOGUE, ROUTE_LINK_PRODUCT } from "../routes";
import { authStore } from "../../auth/store/AuthStore";
import { Price } from "../../../ui/atoms/Price";
import { Checkbox } from "../../discounts/ui/atoms/Checkbox";
import useDebounce from "../../utils/hooks/useDebounce";

const getSaleStatus = (tab: number) => {
    if (tab === 0) {
        return "none";
    }
    if (tab === 1) {
        return "inSale";
    }
    return undefined;
};

const getColumns = (t: TFunction, activeTab: number, role?: Role): Column<Product>[] => [
    {
        Header: t("label") as string,
        accessor: "name",
        width: "2fr",
        Cell: ({ cell, row }) => (
            <>
                <Avatar
                    key={row?._id}
                    size="xs"
                    Placeholder={WinePlaceholder}
                    alt={cell}
                    photoUrl={row.photo?.url}
                    objectFit="contain"
                />

                <span className="ml-4 truncate">{cell}</span>
            </>
        ),
        canSort: true
    },
    {
        Header: t("manufacturer.plural_0") as string,
        accessor: "manufacturer",
        id: "manufacturer.name",
        width: "1.5fr",
        Cell: ({ cell }) => (
            <span className="truncate">{cell?.name || "—"}</span>
        ),
        canSort: true,
        isVisible: role !== "manufacturer"
    },
    {
        Header: t("country") as string,
        accessor: "region",
        width: "1fr",
        Cell: ({ cell }) => cell?.country?.name || "—",
        isVisible: role !== "manufacturer"
    },
    {
        Header: <span className="text-right flex-1">{t("printedCount")}</span>,
        accessor: "printedCount",
        width: "1fr",
        Cell: ({ cell }) => (
            <span className="inline-block w-full text-right">
                {cell ?? "—"}
            </span>
        ),
        canSort: true
    },
    {
        Header: <span className="text-right flex-1">{t("scan1")}</span>,
        accessor: "scan1",
        width: "1fr",
        canSort: true,
        Cell: ({ cell }) => (
            <span className="inline-block w-full text-right">
                {cell ?? "—"}
            </span>
        )
    },
    {
        Header: <span className="text-right flex-1">{t("scan2")}</span>,
        accessor: "scan2",
        width: "1fr",
        canSort: true,
        Cell: ({ cell }) => (
            <span className="inline-block w-full text-right">
                {cell ?? "—"}
            </span>
        )
    },
    {
        Header: <span className="text-right flex-1">{t("repeated")}</span>,
        accessor: "repeated",
        width: "1fr",
        canSort: true,
        Cell: ({ cell }) => (
            <span className="inline-block w-full text-right">
                {cell ?? "—"}
            </span>
        )
    },
    {
        Header: <span className="text-right flex-1">{t("orders.quantity")}</span>,
        accessor: "stockCount",
        width: "1fr",
        canSort: true,
        Cell: ({ cell }) => (
            <span className="inline-block w-full text-right">
                {cell ?? "—"}
            </span>
        ),
        isVisible: role === "manufacturer"
    },
    {
        Header: <span className="text-right flex-1">{t("sold")}</span>,
        accessor: "sold",
        width: "1fr",
        canSort: true,
        Cell: ({ cell }) => (
            <span className="inline-block w-full text-right">
                {cell ?? "—"}
            </span>
        )
    },
    {
        Header: <span className="text-right flex-1">{t("price")}</span>,
        accessor: "price",
        width: "0.8fr",
        canSort: true,
        Cell: ({ cell, row }) => (
            <Price
                newPrice={row.newPrice}
                price={cell}
                isAvailableForSale={row.isAvailableForSale}
            />
        )
    },
    {
        accessor: "_id",
        width: 46,
        Cell: ({ row }) => (
            <PoppedMoreIcon
                item={row as Product}
                restoreMode={activeTab === 3}
                inSale={activeTab === 1}
                onPromotion={activeTab === 2}
            />
        )
    }
];
export const Main = observer(() => {
    const { t } = useTranslation();
    const { search, handleSearch, activeTab, setTab, qvinoSearch, setQvinoSearch } = useContext(
        catalogueStore
    );
    const debouncedSearch = useDebounce(search, 500);
    const { user } = useContext(authStore);
    const history = useHistory();
    const extraArgs = useMemo(
        () => ({
            isDeleted: activeTab === 3,
            saleStatus: getSaleStatus(activeTab),
            role: user?.role === "manufacturer" ? "manufacturer" : "admin",
            isPromoted: activeTab === 2 ? true : undefined,
            isQvino: qvinoSearch
        }),
        [activeTab, qvinoSearch, user?.role]
    );

    const columns = useMemo(() => getColumns(t, activeTab, user?.role)
        .filter(column => !column.hasOwnProperty("isVisible") || column.isVisible),
    [activeTab, t, user?.role]);

    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            handleSearch(event.target.value);
        },
        [handleSearch]
    );

    const handleCreateClick = () => {
        history.push(`${ROUTE_LINK_CATALOGUE}/create`);
    };

    const handleRowClick = useCallback(
        (data: Product) => {
            history.push(`${ROUTE_LINK_PRODUCT}/${data._id}`);
        },
        [history]
    );
    const fetchFn = useCallback(
        args => CatalogueAPI.getList({ ...args, ...extraArgs }),
        [extraArgs]
    );
    const { data, isLoading, pageCount, fetch } = useTableFetch<Product>({
        id: `wine-catalogue-${activeTab}`,
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
                <Button onClick={handleCreateClick} text={t("add")} />
            </section>
            <section className="flex flex-row justify-between">
                <TabList
                    className="px-50p"
                    activeIndex={activeTab}
                    onChange={setTab}
                    options={[
                        t("notOnTheShowCase"),
                        t("onTheShowCase"),
                        t("onPromotion"),
                        t("deleted")
                    ]}
                />
                {user?.role !== "manufacturer" && 
                <span className="flex flex-row items-center mr-50p">
                    <Checkbox 
                        isChecked={qvinoSearch}
                        onClick={() => setQvinoSearch(!qvinoSearch)} 
                    />
                    <p className="ml-4 text-14 text-dark-text">{t("qvinosVines")}</p>
                </span>}
            </section>
            <Table
                data={data}
                isLoading={isLoading}
                pageCount={pageCount}
                fetch={fetch}
                columns={columns as Column}
                className="px-50p mt-8"
                sortedColumn={"name"}
                handleRowClick={handleRowClick}
                id={`wine-catalogue-${activeTab}`}
                search={debouncedSearch}
            />
        </>
    );
});
