import { TFunction } from "i18next";
import { RefObject } from "react";
import { Avatar } from "../../ui/atoms/Avatar";
import { WinePlaceholder } from "../../ui/atoms/illustration";
import { TableControls } from "../../ui/organisms/Table";
import { Column } from "../../ui/organisms/Table/types";
import { ListResponse } from "../types";
import { DirectoryAPI } from "../utils/api/requests/directory-requests";
import { GRAPESORT_EDIT_MODAL } from "./ui/modals/GrapeSortModal";
import { MANUFACTURER_EDIT_MODAL } from "./ui/modals/ManufacturerModal";
import { REGION_EDIT_MODAL } from "./ui/modals/RegionModal";
import { RETAILER_EDIT_MODAL } from "./ui/modals/RetailerModal";
import { WINESTYLE_EDIT_MODAL } from "./ui/modals/WineStyleModal";
import { PoppedMoreIcon } from "./ui/molecules/PoppedMoreIcon";

interface Directory<DType extends object = Record<string, any>> {
    id: string;
    getList: (opt: any) => Promise<ListResponse<DType>>;
    removeFn: any;
    i18: "manufacturer" | "grapeSort" | "region" | "wineStyle" | "retailer";
    sort: string;
    editModal: string;
    getColumns: (
        t: TFunction,
        onDelete: (id: string) => void,
        onEdit: (item: DType) => void,
        ref: RefObject<TableControls>
    ) => Column<DType>[];
}
export const DIRECTORIES: Directory[] = [
    {
        id: "manufacturers",
        getList: DirectoryAPI.getManufacturers,
        removeFn: DirectoryAPI.removeManufacturer,
        i18: "manufacturer",
        sort: "name",
        editModal: MANUFACTURER_EDIT_MODAL,
        getColumns: (t, onDelete, onEdit, ref) => [
            {
                Header: t("manufacturer.plural_0") as string,
                accessor: "name",
                width: "2fr",
                canSort: true,
                Cell: ({ cell, row }) => (
                    <>
                        <Avatar
                            key={row?._id}
                            size="xs"
                            Placeholder={WinePlaceholder}
                            alt={cell}
                            photoUrl={row.logo?.url}
                            objectFit="contain"
                        />

                        <span className="ml-4 truncate">{cell}</span>
                    </>
                )
            },
            {
                Header: t("country") as string,
                accessor: "country",
                Cell: ({ cell }) => cell?.name ?? "—",
                canSort: true,
                width: "1fr"
            },
            {
                accessor: "_id",
                width: 46,
                Cell: ({ cell, row }) => (
                    <PoppedMoreIcon
                        tableRef={ref}
                        onDelete={() => onDelete(cell)}
                        onEdit={() => onEdit(row)}
                    />
                )
            }
        ]
    },
    {
        id: "retailers",
        getList: DirectoryAPI.getRetailers,
        removeFn: DirectoryAPI.removeRetailer,
        i18: "retailer",
        sort: "name",
        editModal: RETAILER_EDIT_MODAL,
        getColumns: (t, onDelete, onEdit, ref) => [
            {
                Header: t("title") as string,
                accessor: "name",
                width: "2fr",
                canSort: true,
                Cell: ({ cell, row }) => (
                    <>
                        <Avatar
                            key={row?._id}
                            size="xs"
                            Placeholder={WinePlaceholder}
                            alt={cell}
                            photoUrl={row.logo?.url}
                            objectFit="contain"
                        />

                        <span className="ml-4 truncate">{cell}</span>
                    </>
                )
            },
            {
                accessor: "_id",
                width: 46,
                Cell: ({ cell, row }) => (
                    <PoppedMoreIcon
                        tableRef={ref}
                        onDelete={() => onDelete(cell)}
                        onEdit={() => onEdit(row)}
                    />
                )
            }
        ]
    },
    {
        id: "grapeSorts",
        getList: DirectoryAPI.getGrapeSorts,
        removeFn: DirectoryAPI.removeGrapeSort,
        i18: "grapeSort",
        sort: "name",
        editModal: GRAPESORT_EDIT_MODAL,
        getColumns: (t, onDelete, onEdit, ref) => [
            {
                Header: t("label") as string,
                accessor: "name",
                width: "auto",
                canSort: true
            },
            {
                accessor: "_id",
                width: 46,
                Cell: ({ cell, row }) => (
                    <PoppedMoreIcon
                        tableRef={ref}
                        onDelete={() => onDelete(cell)}
                        onEdit={() => onEdit(row)}
                    />
                )
            }
        ]
    },
    {
        id: "regions",
        getList: DirectoryAPI.getRegions,
        removeFn: DirectoryAPI.removeRegion,
        i18: "region",
        sort: "name",
        editModal: REGION_EDIT_MODAL,
        getColumns: (t, onDelete, onEdit, ref) => [
            {
                Header: t("country") as string,
                accessor: "country",
                Cell: ({ cell }) => cell?.name ?? "—",
                canSort: true,
                width: "auto"
            },
            {
                Header: t("region.plural_0") as string,
                accessor: "name",
                canSort: true,
                width: "auto"
            },
            {
                accessor: "_id",
                width: 46,
                Cell: ({ cell, row }) => (
                    <PoppedMoreIcon
                        tableRef={ref}
                        onDelete={() => onDelete(cell)}
                        onEdit={() => onEdit(row)}
                    />
                )
            }
        ]
    },
    {
        id: "wineStyles",
        getList: DirectoryAPI.getVineStyles,
        removeFn: DirectoryAPI.removeVineStyle,
        i18: "wineStyle",
        sort: "name",
        editModal: WINESTYLE_EDIT_MODAL,
        getColumns: (t, onDelete, onEdit, ref) => [
            {
                Header: t("title") as string,
                accessor: "name",
                canSort: true,
                width: "auto"
            },
            {
                accessor: "_id",
                width: 46,
                Cell: ({ cell, row }) => (
                    <PoppedMoreIcon
                        tableRef={ref}
                        onDelete={() => onDelete(cell)}
                        onEdit={() => onEdit(row)}
                    />
                )
            }
        ]
    }
];
