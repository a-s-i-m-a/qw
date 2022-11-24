import { observer } from "mobx-react-lite";
import React, { useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../ui/atoms/Button";
import { Search } from "../../../ui/atoms/Search";
import { Table } from "../../../ui/organisms/Table";
import { Column } from "../../../ui/organisms/Table/types";
import { useTableFetch } from "../../../ui/organisms/Table/useTableFetch";
import { authStore } from "../../auth/store/AuthStore";
import { Salepoint } from "../../types";
import { SalepointsAPI } from "../../utils/api/requests/salepoints-requests";
import useDebounce from "../../utils/hooks/useDebounce";
import { ROUTE_LINK_SALEPOINTS } from "../routes";
import { salepointsStore } from "../store/SalepointsStore";
import { Empty } from "../ui/atoms/Empty";
import { PoppedMoreIcon } from "../ui/molecules/PoppedMoreIcon";

export const Main = observer(() => {
    const { t } = useTranslation();
    const { search, handleSearch, setEditing, isEmpty, setEmpty } = useContext(
        salepointsStore
    );
    const debouncedSearch = useDebounce(search, 500);
    const { user } = useContext(authStore);
    const history = useHistory();
    const extraArgs = useMemo(
        () => ({
            role: "retailer",
            retailerId: user?.retailer?._id
        }),
        [user]
    );
    const columns: Column<Salepoint>[] = useMemo(
        () => [
            {
                Header: t("salepoints.city") as string,
                accessor: "location",
                id: "location.city",
                width: "1fr",
                Cell: ({ cell }) => (
                    <span className="truncate">{cell?.city}</span>
                ),
                canSort: true
            },
            {
                Header: t("salepoints.address") as string,
                accessor: "location",
                id: "location.address",
                width: "3fr",
                Cell: ({ cell }) => (
                    <span className="truncate">{cell?.address}</span>
                ),
                canSort: true
            },
            {
                accessor: "_id",
                width: 46,
                Cell: ({ row }) => <PoppedMoreIcon item={row} />
            }
        ],
        [t]
    );

    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            handleSearch(event.target.value);
        },
        [handleSearch]
    );

    const fetchFn = useCallback(
        async args => {
            const data = await SalepointsAPI.getList({
                ...args,
                ...extraArgs
            });
            if (!data.items.length) {
                setEmpty(true);
            }
            return data;
        },
        [extraArgs, setEmpty]
    );
    const { data, isLoading, pageCount, fetch } = useTableFetch<Salepoint>({
        id: `salepoints`,
        fetchFn
    });

    const handleCreateClick = () => {
        setEditing(true);
        history.push(`${ROUTE_LINK_SALEPOINTS}/create`);
    };

    const handleRowClick = useCallback(
        (data: Salepoint) => {
            history.push(`${ROUTE_LINK_SALEPOINTS}/${data?._id}`);
        },
        [history]
    );

    if (isEmpty && !search) {
        return <Empty />;
    }

    return (
        <>
            <section className="flex justify-between mb-8 px-50p">
                <Search
                    className="w-300p"
                    value={search}
                    onChange={handleSearchChange}
                />
                <Button onClick={handleCreateClick} text={t("create")} />
            </section>
            <Table
                columns={columns}
                data={data}
                isLoading={isLoading}
                pageCount={pageCount}
                fetch={fetch}
                className="px-50p mt-8"
                id="gifts"
                handleRowClick={handleRowClick}
                search={debouncedSearch}
            />
        </>
    );
});
