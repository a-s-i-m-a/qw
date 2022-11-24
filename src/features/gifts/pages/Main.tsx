import { observer } from "mobx-react-lite";
import React, { useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Avatar } from "../../../ui/atoms/Avatar";
import { Button } from "../../../ui/atoms/Button";
import { WinePlaceholder } from "../../../ui/atoms/illustration";
import { Search } from "../../../ui/atoms/Search";
import { Table } from "../../../ui/organisms/Table";
import { Column } from "../../../ui/organisms/Table/types";
import { useTableFetch } from "../../../ui/organisms/Table/useTableFetch";
import { getSafariFriendlyDate } from "../../catalogue/utils/getSafariFriendlyDate";
import { Languages } from "../../types";
import { GiftAPI } from "../../utils/api/requests/gift-request";
import useDebounce from "../../utils/hooks/useDebounce";
import { ROUTE_LINK_GIFTS } from "../routes";
import { giftsStore } from "../store/GiftsStore";
import { GiftPayload } from "../types";
import { PoppedMoreIcon } from "../ui/molecules/PoppedMoreIcon";

export const Main = observer(() => {
    const { t, i18n } = useTranslation();
    const { search, handleSearch, setGiftEditing } = useContext(giftsStore);
    const debouncedSearch = useDebounce(search, 500);
    const history = useHistory();
    const extraArgs = useMemo(
        () => ({
            role: "admin"
        }),
        []
    );

    const columns: Column<GiftPayload>[] = useMemo(
        () => [
            {
                Header: t("label") as string,
                accessor: "name",
                width: "3fr",
                Cell: ({ cell, row }) => (
                    <div className="flex items-center">
                        <Avatar
                            key={row?._id}
                            size="xs"
                            objectFit={"cover"}
                            photoUrl={row.photo?.url}
                            Placeholder={WinePlaceholder}
                            alt={cell[i18n.language as Languages]}
                        />
                        <span className="ml-4">{cell[i18n.language as Languages] || "—"}</span>
                    </div>
                ),
                canSort: true
            },
            {
                Header: <span className="text-right flex-1">{t("gift.quantity")}</span>,
                accessor: "stockCount",
                width: "1fr",
                Cell: ({ cell }) => (
                    <div className="inline-block w-full text-right">{cell || "—"}</div>
                ),
                canSort: true
            },
            {
                Header: <span className="text-right flex-1">{t("gift.pricePoints")}</span>,
                accessor: "price",
                width: "1fr",
                Cell: ({ cell }) => {
                    return (
                        <div className="inline-block w-full text-right">
                            {cell?.value || "—"}
                        </div>
                    );
                },
                canSort: true
            },
            {
                Header: t("createDate") as string,
                accessor: "createDate",
                canSort: true,
                width: "1fr",
                Cell: ({ cell }) => (
                    <span>
                        {cell
                            ? getSafariFriendlyDate(cell).format("DD.MM.YYYY HH:mm")
                            : "—"}
                    </span>
                )
            },
            {
                Header: <span className="text-right flex-1">{t("status")}</span>,
                accessor: "saleStatus",
                width: "1fr",
                Cell: ({ cell }) => {
                    return (
                        <div className="inline-block w-full text-right">
                            {cell === "inSale" ? t("onSale") : t("gift.notAvailable")}
                        </div>
                    );
                },
                canSort: true
            },
            {
                accessor: "_id",
                width: 46,
                Cell: ({ row }) => <PoppedMoreIcon item={row} />
            }
        ],
        [ t, i18n ]
    );

    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            handleSearch(event.target.value);
        },
        [handleSearch]
    );

    const fetchFn = useCallback(
        async args =>
            await GiftAPI.getList({
                ...args,
                ...extraArgs
            }),
        [extraArgs]
    );

    const { data, isLoading, pageCount, fetch } = useTableFetch<GiftPayload>({
        id: `gifts`,
        fetchFn
    });

    const handleCreateClick = () => {
        setGiftEditing(true);
        history.push(`${ROUTE_LINK_GIFTS}/create`);
    };

    const handleRowClick = useCallback(
        (data: GiftPayload) => {
            history.push(`${ROUTE_LINK_GIFTS}/${data?._id}`);
        },
        [history]
    );
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
            <Table
                columns={columns}
                data={data}
                isLoading={isLoading}
                pageCount={pageCount}
                fetch={fetch}
                className="px-50p mt-8"
                id="gifts"
                handleRowClick={handleRowClick}
                sortedColumn={"-createDate"}
                search={debouncedSearch}
            />
        </>
    );
});