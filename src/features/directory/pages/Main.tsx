import { useCallback, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../ui/atoms/Button";
import { Search } from "../../../ui/atoms/Search";
import { Table, TableControls } from "../../../ui/organisms/Table";
import { TabList } from "../../../ui/organisms/TabList";
import { observer } from "mobx-react-lite";
import { DIRECTORIES } from "../consts";
import { modalPageStore } from "../../modalpage/store/ModalPageStore";
import { DIRECTORY_DELETE_MODAL } from "../ui/modals/DeleteModal";
import { directoryStore } from "../store/DirectoryStore";
import { useTableFetch } from "../../../ui/organisms/Table/useTableFetch";
import useDebounce from "../../utils/hooks/useDebounce";

export const Main = observer(() => {
    const { t } = useTranslation();
    const { openModal, setModalCallback } = useContext(modalPageStore);
    const { search, handleSearch, activeTab, setTab } = useContext(
        directoryStore
    );
    const debouncedSearch = useDebounce(search, 500);
    const tableRef = useRef<TableControls>(null);

    const onTabChange = (tab: number) => {
        handleSearch("");
        setTab(tab);
    };

    const onAddClick = () => {
        setModalCallback(
            DIRECTORIES[activeTab].editModal,
            (isSuccess: boolean) => {
                isSuccess && tableRef.current && tableRef.current.refetch();
            }
        );
        openModal(DIRECTORIES[activeTab].editModal);
    };

    const onEdit = useCallback(
        (item: object) => {
            setModalCallback(
                DIRECTORIES[activeTab].editModal,
                (isSuccess: boolean) => {
                    isSuccess && tableRef.current && tableRef.current.refetch();
                }
            );

            openModal(DIRECTORIES[activeTab].editModal, {
                item
            });
        },
        [activeTab, openModal, setModalCallback]
    );

    const onDelete = useCallback(
        (id: string) => {
            setModalCallback(DIRECTORY_DELETE_MODAL, (isSuccess: boolean) => {
                isSuccess && tableRef.current && tableRef.current.refetch();
            });
            openModal(DIRECTORY_DELETE_MODAL, {
                i18n: DIRECTORIES[activeTab].i18,
                id,
                removeFn: DIRECTORIES[activeTab].removeFn
            });
        },
        [activeTab, openModal, setModalCallback]
    );

    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            handleSearch(event.target.value);
        },
        [handleSearch]
    );
    const fetchFn = useCallback(
        args => DIRECTORIES[activeTab].getList({ ...args }),
        [activeTab]
    );
    const { data, isLoading, pageCount, fetch } = useTableFetch({
        id: DIRECTORIES[activeTab].id,
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
                <Button text={t("add")} onClick={onAddClick} />
            </section>
            <TabList
                className="px-50p"
                activeIndex={activeTab}
                onChange={onTabChange}
                options={DIRECTORIES.map(item => t(`${item.i18}.plural_1`))}
            />
            <Table
                data={data}
                isLoading={isLoading}
                pageCount={pageCount}
                fetch={fetch}
                tableRef={tableRef}
                columns={DIRECTORIES[activeTab].getColumns(
                    t,
                    onDelete,
                    onEdit,
                    tableRef
                )}
                className="px-50p mt-8"
                sortedColumn={DIRECTORIES[activeTab].sort}
                handleRowClick={onEdit}
                id={DIRECTORIES[activeTab].id}
                search={debouncedSearch}
            />
        </>
    );
});
