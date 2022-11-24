import { useCallback, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "../../../ui/atoms/Search";
import { TabList } from "../../../ui/organisms/TabList";
import { observer } from "mobx-react-lite";
import { tasksStore } from "../store/TasksStore";
import { Button } from "../../../ui/atoms/Button";
import { useMemo } from "react";
import { Column } from "../../../ui/organisms/Table/types";
import { ExpertTask, ExpertTaskStatuses, Role } from "../../types";
import { Avatar } from "../../../ui/atoms/Avatar";
import { WinePlaceholder } from "../../../ui/atoms/illustration";
import { Table, TableControls } from "../../../ui/organisms/Table";
import { PromosAPI } from "../../utils/api/requests/promos-requests";
import { useHistory } from "react-router-dom";
import { authStore } from "../../auth/store/AuthStore";
import { PROMOTION_SET_TASK_MODAL } from "../../promotion/ui/modals/SetTaskModal";
import { modalPageStore } from "../../modalpage/store/ModalPageStore";
import { useTableFetch } from "../../../ui/organisms/Table/useTableFetch";
import { TFunction } from "i18next";
import { getSafariFriendlyDate } from "../../catalogue/utils/getSafariFriendlyDate";
import useDebounce from "../../utils/hooks/useDebounce";

const TABS: Record<
    Role | string,
    {
        label: "inWork" | "waitingForReview" | "finished";
        value: ExpertTaskStatuses;
    }[]
> = {
    expert: [
        {
            label: "inWork",
            value: "pending"
        },
        {
            label: "waitingForReview",
            value: "completed"
        },
        {
            label: "finished",
            value: "accepted"
        }
    ],
    admin: [
        {
            label: "waitingForReview",
            value: "completed"
        },
        {
            label: "inWork",
            value: "pending"
        }
    ]
};

const getColumns = (t: TFunction): Column<ExpertTask>[] => [
    {
        Header: t("label") as string,
        accessor: "product",
        width: "2fr",
        id: "product.name",
        Cell: ({ cell, row }) => (
            <>
                <Avatar
                    key={row?._id}
                    size="xs"
                    Placeholder={WinePlaceholder}
                    alt={cell?.name}
                    photoUrl={cell?.photo?.url}
                    objectFit="contain"
                />

                <span className="ml-4 truncate">{cell?.name ?? "—"}</span>
            </>
        ),
        canSort: true
    },
    {
        Header: t("manufacturer.plural_0") as string,
        accessor: "product",
        id: "product.manufacturer.name",
        width: "1fr",
        Cell: ({ cell }) => (
            <span className="truncate">{cell?.manufacturer?.name || "—"}</span>
        ),
        canSort: true
    },
    {
        Header: t("performer") as string,
        accessor: "expert",
        id: "expert.name",
        width: "1fr",
        Cell: ({ cell }) => (
            <span className="truncate">{cell?.name || "—"}</span>
        ),
        canSort: true
    },
    {
        Header: t("createDate") as string,
        accessor: "createDate",
        width: 145,
        Cell: ({ cell }) =>
            cell ? getSafariFriendlyDate(cell).format("DD.MM.YYYY HH:mm") : "—",
        canSort: true
    },
    {
        Header: t("taskType") as string,
        accessor: "type",
        width: 140,
        Cell: ({ cell }) => (
            <span className="truncate">
                {cell === "video" ? t("video.plural_0") : t("review.plural_0")}
            </span>
        )
    }
];
const getTabsObject = (role: Role) => {
    if (role === "expert") {
        return TABS.expert;
    }
    return TABS.admin;
};
export const Main = observer(() => {
    const translation = useTranslation();
    const { t } = translation;
    const { search, handleSearch, activeTab, setTab } = useContext(tasksStore);
    const debouncedSearch = useDebounce(search, 500);
    const { openModal } = useContext(modalPageStore);
    const { user } = useContext(authStore);
    const { push } = useHistory();
    const tableRef = useRef<TableControls>(null);
    const extraArgs = useMemo(
        () => ({
            status: getTabsObject(user!.role)[activeTab].value,
            role: user?.role === "expert" ? "expert" : "admin"
        }),
        [user, activeTab]
    );

    const onTabChange = (tab: number) => {
        handleSearch("");
        setTab(tab);
    };

    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            handleSearch(event.target.value);
        },
        [handleSearch]
    );

    const columns = useMemo(
        () =>
            getColumns(t).filter(
                column =>
                    !(user!.role === "expert" && column.accessor === "expert")
            ),
        [t, user]
    );
    const handleRowClick = useCallback(
        (row: ExpertTask) => {
            push(`/task/${row._id}`);
        },
        [push]
    );

    const setTask = () => {
        openModal(PROMOTION_SET_TASK_MODAL);
    };
    const fetchFn = useCallback(
        args => PromosAPI.getTasks({ ...args, ...extraArgs }),
        [extraArgs]
    );

    const { data, isLoading, pageCount, fetch } = useTableFetch({
        id: `tasks-${activeTab}`,
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
                {user?.role !== "expert" && (
                    <Button text={t("setTask")} onClick={setTask} />
                )}
            </section>
            <TabList
                className="px-50p"
                activeIndex={activeTab}
                onChange={onTabChange}
                options={getTabsObject(user!.role).map(tab => t(tab.label))}
            />

            <Table
                data={data}
                isLoading={isLoading}
                pageCount={pageCount}
                fetch={fetch}
                tableRef={tableRef}
                className="mt-8"
                tableClassName="px-50p"
                columns={columns}
                sortedColumn="-createDate"
                handleRowClick={handleRowClick}
                id={`tasks-${activeTab}`}
                search={debouncedSearch}
            />
        </>
    );
});
