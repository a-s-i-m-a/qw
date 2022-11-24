import { useCallback, useContext, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "../../../ui/atoms/Search";
import { Table, TableControls } from "../../../ui/organisms/Table";
import { TabList } from "../../../ui/organisms/TabList";
import { observer } from "mobx-react-lite";
import { promotionStore } from "../store/PromotionStore";
import { useHistory } from "react-router-dom";
import { PROMOTION_PARTS } from "../consts";
import { PoppedCreateButton } from "../ui/molecules/PoppedCreateButton";
import { useTableFetch } from "../../../ui/organisms/Table/useTableFetch";
import { authStore } from "../../auth/store/AuthStore";
import { PageHeader } from "../../../ui/molecules/PageHeader";
import { Button } from "../../../ui/atoms/Button";
import { ProgramDescription } from "../ui/organisms/ProgramDescription";
import { useEffect } from "react";
import { PERSONAL_OFFER_REQUEST } from "../ui/modals/PersonalOfferModal";
import { useModal } from "../../modalpage/hooks";
import useDebounce from "../../utils/hooks/useDebounce";

export const Main = observer(() => {
    const translation = useTranslation();
    const { t } = translation;
    const history = useHistory();
    const { search, handleSearch, activeTab, setTab } = useContext(
        promotionStore
    );
    const debouncedSearch = useDebounce(search, 500);
    const { user } = useContext(authStore);
    const { push } = useHistory();
    const tableRef = useRef<TableControls>(null);
    const extraArgs = useMemo(
        () => ({
            role: user!.role === "manufacturer" ? "manufacturer" : "admin"
        }),
        [user]
    );

    const onTabChange = (tab: number) => {
        handleSearch("");
        setTab(tab);
    };

    const fetchFn = useCallback(
        args => PROMOTION_PARTS[activeTab].getList({ ...args, ...extraArgs }),
        [activeTab, extraArgs]
    );
    const {
        data,
        isLoading,
        pageCount,
        itemsCount,
        isFetching,
        fetch,
        setLoading
    } = useTableFetch({
        id: PROMOTION_PARTS[activeTab].id,
        fetchFn
    });
    const { openModal } = useModal();
    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setLoading();
            handleSearch(event.target.value);
        },
        [setLoading, handleSearch]
    );

    const handleRowClick = useCallback(
        (row: Record<string, unknown>) => {
            push(`/${PROMOTION_PARTS[activeTab].itemUrl}/${row._id}`);
        },
        [activeTab, push]
    );
    useEffect(() => {
        // because of not rendering table we should prefetch
        if (user?.role === "manufacturer") {
            fetch({
                pageIndex: 0,
                sort:
                    PROMOTION_PARTS[activeTab].sort ??
                    PROMOTION_PARTS[activeTab].id
            });
        }
    }, [activeTab, fetch, user?.role]);

    const addWine = () => {
        history.push("promotion/create");
    };

    const wantPersonalOffer = () => {
        openModal(PERSONAL_OFFER_REQUEST);
    };

    const programView = useMemo(
        () => itemsCount === 0 && search === "" && !isFetching,
        [isFetching, itemsCount, search]
    );

    return (
        <>
            {user!.role !== "manufacturer" && (
                <>
                    <section className="flex justify-between mb-8 px-50p">
                        <Search
                            className="w-300p"
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <PoppedCreateButton />
                    </section>
                    <TabList
                        className="px-50p mb-8"
                        activeIndex={activeTab}
                        onChange={onTabChange}
                        options={[
                            t("application.plural_1"),
                            t("video.plural_1"),
                            t("review.plural_1"),
                            t("articles.plural_1")
                        ]}
                    />
                </>
            )}
            {user!.role === "manufacturer" && (
                <>
                    {programView ? (
                        <PageHeader
                            title={t("qvinoMarketingProgram")}
                            className="px-50p"
                        >
                            <Button
                                text={t("personalOffer")}
                                type="secondary"
                                onClick={wantPersonalOffer}
                            />
                            <Button text={t("addWine")} onClick={addWine} />
                        </PageHeader>
                    ) : (
                        <PageHeader
                            className="px-50p"
                            afterTitle={
                                <Search
                                    className="w-300p"
                                    value={search}
                                    onChange={handleSearchChange}
                                />
                            }
                        >
                            <Button
                                text={t("requestPersonalOffer")}
                                type="secondary"
                                onClick={wantPersonalOffer}
                            />
                            <Button text={t("add")} onClick={addWine} />
                        </PageHeader>
                    )}
                </>
            )}

            {(user!.role !== "manufacturer" || !programView) && (
                <Table
                    tableRef={tableRef}
                    data={data}
                    isLoading={isLoading}
                    pageCount={pageCount}
                    fetch={fetch}
                    tableClassName="px-50p"
                    columns={PROMOTION_PARTS[activeTab].getColumns(
                        translation,
                        user!.role
                    )}
                    sortedColumn={PROMOTION_PARTS[activeTab].sort}
                    handleRowClick={handleRowClick}
                    id={PROMOTION_PARTS[activeTab].id}
                    search={debouncedSearch}
                />
            )}
            {user?.role === "manufacturer" && programView && (
                <ProgramDescription className="px-50p" />
            )}
        </>
    );
});
