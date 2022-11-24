import { observer } from "mobx-react-lite";
import React, { useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button } from "../../../ui/atoms/Button";
import { Search } from "../../../ui/atoms/Search";
import { Table } from "../../../ui/organisms/Table";
import { Column } from "../../../ui/organisms/Table/types";
import { useTableFetch } from "../../../ui/organisms/Table/useTableFetch";
import { modalPageStore } from "../../modalpage/store/ModalPageStore";
import { Certificate } from "../../types";
import { CertificatesAPI } from "../../utils/api/requests/certificates-requests";
import useDebounce from "../../utils/hooks/useDebounce";
import { ROUTE_LINK_CERTIFICATES } from "../routes";
import { certificatesStore } from "../store/CertificatesStore";
import { EmptyCertificates } from "../ui/atoms/EmptyCertificates";
import { ADD_CERTIFICATE_MODAL } from "../ui/modals/AddCertificateModal";
import { PoppedMoreIcon } from "../ui/molecules/PoppedMoreCertificate";

export const Main = observer(() => {
    const { t } = useTranslation();
    const history = useHistory();
    const { search, handleSearch } = useContext(certificatesStore);
    const debouncedSearch = useDebounce(search, 500);
    const { openModal, setModalCallback } = useContext(modalPageStore);
    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            handleSearch(event.target.value);
        },
        [handleSearch]
    );
    const extraArgs = useMemo(
        () => ({
            role: "admin"
        }),
        []
    );
    const columns: Column<Certificate>[] = useMemo(
        () => [
            {
                Header: t("country") as string,
                accessor: "country",
                Cell: ({ cell }) => cell?.name ?? "—",
                canSort: true,
                width: "1fr"
            },
            {
                Header: (
                    <span className="text-right flex-1">
                        {t("certificate.levelsQty")}
                    </span>
                ),
                accessor: "totalLevelCount",
                Cell: ({ cell }) => (
                    <span className="text-right flex-1">{cell ?? 0}</span>
                ),
                width: "1fr"
            },
            {
                Header: (
                    <span className="text-right flex-1">
                        {t("certificate.publishedLevels")}
                    </span>
                ),
                accessor: "levelCount",
                Cell: ({ cell }) => (
                    <span className="text-right flex-1">{cell ?? 0}</span>
                ),
                width: "1fr"
            },
            {
                Header: (
                    <span className="text-right flex-1">{t("status")}</span>
                ),
                accessor: "status",
                width: "1fr",
                Cell: ({ cell }) => {
                    return (
                        <div className="inline-block w-full text-right">
                            {cell === "pending"
                                ? t("certificate.unpublished")
                                : t("certificate.published")}
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
        [t]
    );
    const handleCreateClick = () => {
        setModalCallback(
            ADD_CERTIFICATE_MODAL,
            (isSuccess: boolean, data: any) => {
                isSuccess &&
                    history.push(`${ROUTE_LINK_CERTIFICATES}/${data?._id}`);
            }
        );
        openModal(ADD_CERTIFICATE_MODAL);
    };
    const handleRowClick = useCallback(
        (data: any) => {
            history.push(`${ROUTE_LINK_CERTIFICATES}/${data?._id}`);
        },
        [history]
    );

    const fetchFn = useCallback(
        async args =>
            await CertificatesAPI.getCertificatesList({
                ...args,
                ...extraArgs
            }),
        [extraArgs]
    );
    const { data, isLoading, pageCount, fetch } = useTableFetch<Certificate>({
        id: `certificates`,
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
            <Table
                columns={columns}
                data={data}
                isLoading={isLoading}
                pageCount={pageCount}
                fetch={fetch}
                className="px-50p mt-8"
                id="certificates"
                handleRowClick={handleRowClick}
                CustomEmptyState={() => (
                    <EmptyCertificates page="certificate" />
                )}
                sortedColumn={"country"}
                search={debouncedSearch}
            />
        </>
    );
});
