import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useCallback, useContext, useMemo } from "react";

import { TabList } from "../../../ui/organisms/TabList";
import { Search } from "../../../ui/atoms/Search";
import { User } from "../../types";

import { Table } from "../../../ui/organisms/Table";
import { Column } from "../../../ui/organisms/Table/types";
import { UserAPI } from "../../utils/api/requests/user-requests";
import { UserAvatar } from "../../../ui/atoms/UserAvatar";
import { PoppedMoreIcon } from "../ui/molecules/PoppedMoreIcon";
import { PoppedCreateButton } from "../ui/molecules/PoppedCreateButton";
import { userStore } from "../store/UserStore";
import { useTableFetch } from "../../../ui/organisms/Table/useTableFetch";
import { getSafariFriendlyDate } from "../../catalogue/utils/getSafariFriendlyDate";
import useDebounce from "../../utils/hooks/useDebounce";

const TABS = [
    "user",
    "admin",
    "expert",
    "moderator",
    "manufacturer",
    "retailer"
];

export const Main = observer(() => {
    const { t } = useTranslation();
    const { search, handleSearch, activeTab, setTab } = useContext(userStore);
    const debouncedSearch = useDebounce(search, 500);
    const history = useHistory();

    const extraArgs = useMemo(
        () => ({
            role: TABS[activeTab]
        }),
        [activeTab]
    );

    const columns: Column<User>[] = useMemo(
        () => [
            {
                Header: t("name") as string,
                accessor: "name",
                width: "1.7fr",
                Cell: ({ cell, row }) => (
                    <div className="flex items-center">
                        <UserAvatar key={row?._id} photoUrl={row.photo?.url} alt={cell} />
                        <span className="ml-4">{cell || "—"}</span>
                    </div>
                ),
                canSort: true
            },
            {
                Header: t("login") as string,
                accessor: "login",
                width: "1.7fr",
                Cell: ({ cell }) => (
                    <div className="flex items-center">{cell || "—"}</div>
                ),
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
                Header: t("status") as string,
                accessor: "isBlocked",
                width: "1fr",
                Cell: ({ cell }) => {
                    return (
                        <div className="flex items-center text-14">
                            {cell
                                ? t("blocked.plural_0")
                                : t("active.plural_0")}
                        </div>
                    );
                },
                canSort: true
            },

            {
                accessor: "_id",
                width: 46,
                Cell: ({ row }) => (
                    <PoppedMoreIcon user={row} restoreMode={row.isBlocked} />
                )
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

    const handleRowClick = (user: User) => {
        history.push(`/user/${user._id}`);
    };
    const fetchFn = useCallback(
        args => UserAPI.getList({ ...args, ...extraArgs }),
        [extraArgs]
    );
    const { data, isLoading, pageCount, fetch } = useTableFetch({
        id: `users-${activeTab}`,
        fetchFn
    });
    
    return (
        <>
        <section className={`fixed left-60 right-0 top-0 bg-gray-bg min-w-1400p z-90`}>
            <div className="w-full h-full rounded-tl-30p bg-white pl-50p pt-50p pb-30p">
                <section className="w-header min-w-720p flex justify-between mb-8 pr-50p">
                    <Search
                        onChange={handleSearchChange}
                        className="w-300p"
                        value={search}
                    />
                    <PoppedCreateButton />
                </section>

                <TabList
                    onChange={setTab}
                    activeIndex={activeTab}
                    className="pl-3p"
                    options={[
                        t("user.plural_1"),
                        t("admin.plural_1"),
                        t("expert.plural_1"),
                        t("moderator.plural_1"),
                        t("manufacturer.plural_1"),
                        t("retailer.plural_1")
                    ]}
                />
            </div>
        </section>
            <Table
                data={data}
                isLoading={isLoading}
                pageCount={pageCount}
                fetch={fetch}
                handleRowClick={handleRowClick}
                className="px-50p mt-135p mb-100p"
                sortedColumn={"-createDate"}
                columns={columns}
                id={`users-${activeTab}`}
                search={debouncedSearch}
            />
        </>
    );
});
