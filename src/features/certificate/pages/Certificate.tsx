import { observer } from "mobx-react-lite";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { PageSpinner } from "../../../ui/atoms/PageSpinner";
import { SortableTable } from "../../../ui/organisms/SortableTable";
import { Column } from "../../../ui/organisms/Table/types";
import { Level } from "../../types";
import { CertificatesAPI } from "../../utils/api/requests/certificates-requests";
import { ROUTE_LINK_CERTIFICATES } from "../routes";
import { certificatesStore } from "../store/CertificatesStore";
import { EmptyCertificates } from "../ui/atoms/EmptyCertificates";
import { DetailsHeader } from "../ui/molecules/DetailsHeader";
import { PoppedMoreLevel } from "../ui/molecules/PoppedMoreLevel";
import { reorder } from "../ui/organisms/BlockList/helper";

export interface DefData {
    _id: string;
    number: number;
    name: string;
}

export const Certificate = observer(() => {
    const { t } = useTranslation();
    const formMethods = useForm({
        mode: "onSubmit",
        reValidateMode: "onChange"
    });
    const history = useHistory();
    const { id } = useParams<Record<"id", string>>();
    const {
        levels,
        loadLevels,
        loadCertificate,
        certificate,
        setLevels,
        isLoading
    } = useContext(certificatesStore);
    
    const [sort, setSort] = useState<string | null>("sortNumber");

    const columns: Column<Level>[] = useMemo(
        () => [
            {
                Header: t("certificate.number") as string,
                accessor: "sortNumber",
                Cell: ({ cell }) => cell + 1 ?? "—",
                width: 70,
                canSort: true,
            },
            {
                Header: t("certificate.levelName") as string,
                accessor: "name",
                Cell: ({ cell }) => cell ?? "—",
                width: "3.5fr"
            },
            {
                Header: (
                    <span className="text-right flex-1 cursor-pointer">
                            {t("status")}
                    </span>
                ),
                accessor: "status",
                width: "1fr",
                canSort: true,
                Cell: ({ cell }) => {
                    return (
                        <div className="inline-block w-full text-right">
                            {cell === "pending"
                                ? t("certificate.unpublished")
                                : t("certificate.published")}
                        </div>
                    );
                }
            },
            {
                accessor: "_id",
                width: 46,
                Cell: ({ row }) => <PoppedMoreLevel item={row} />
            }
        ],
        [t]
    );

    useEffect(() => {
        loadCertificate(id);
    }, [ id, loadCertificate]);

    useEffect(() => {
        sort && loadLevels(
            sort,
            id
        );
    }, [id, loadLevels, sort])

    const handleRowClick = useCallback(
        (data: Level) => {
            history.push(`${ROUTE_LINK_CERTIFICATES}/${certificate?._id}/${data?._id}`);
        },
        [certificate?._id, history]
    );

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) {
            return;
        }
        const sourceIndex = result.source.index;
        const destIndex = result.destination.index;
        if (levels?.items?.length) {
            const items = reorder(levels?.items, sourceIndex, destIndex);
            setLevels({ items: items });
            await CertificatesAPI.updateLevel({
                id: result.draggableId,
                formData: { sortNumber: result.destination.index }
            });
        }
    };

    if (!certificate) {
        return <PageSpinner />;
    }

    return (
        <FormProvider {...formMethods}>
            <section className="px-50p h-full">
                <DetailsHeader isCertificate={true} />
                    <SortableTable
                        columns={columns}
                        data={levels?.items ? levels?.items : []}
                        isLoading={isLoading}
                        pageCount={1}
                        className="mt-8"
                        id="levels"
                        handleRowClick={handleRowClick}
                        CustomEmptyState={() => (
                            <EmptyCertificates page="levels" />
                        )}
                        sortedColumn={"sortNumber"}
                        onDragEnd={onDragEnd}
                        disablePagination={true}
                        setSort={setSort}
                    />
            </section>
        </FormProvider>
    );
});
