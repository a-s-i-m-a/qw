import { TFunction } from "i18next";
import { Avatar } from "../../ui/atoms/Avatar";
import { WinePlaceholder } from "../../ui/atoms/illustration";
import { Column } from "../../ui/organisms/Table/types";
import { getSafariFriendlyDate } from "../catalogue/utils/getSafariFriendlyDate";
import { Discounts } from "../types";
import { PoppedMoreIcon } from "./ui/molecules/PoppedMoreIcon";

export const getRetailerColumns = (t: TFunction): Column<Discounts>[] => [
    {
        Header: t("label") as string,
        accessor: "name",
        width: "3fr",
        Cell: ({ cell, row }) => (
            <>
                <Avatar
                    key={row?._id}
                    size="xs"
                    Placeholder={WinePlaceholder}
                    alt={cell}
                    photoUrl={row?.image?.url}
                    objectFit="contain"
                />

                <span className="ml-4 truncate">{cell}</span>
            </>
        ),
        canSort: true
    },
    {
        Header: t("country") as string,
        accessor: "country",
        id: "country",
        canSort: true,
        width: "1fr",
        Cell: ({ cell }) => cell?.name || "—"
    },
    {
        Header: (
            <span className="text-right flex-1">
                {t("salepoints.plural_1")}
            </span>
        ),
        accessor: "retailerStoreIds",
        id: "salepoints",
        width: "1fr",
        Cell: ({ cell }) => (
            <span className="text-right flex-1">{cell?.length || "—"}</span>
        )
    },
    {
        Header: <span className="text-right flex-1">{t("createDate")}</span>,
        accessor: "createDate",
        canSort: true,
        width: "1fr",
        Cell: ({ cell }) => (
            <span className="text-right flex-1">
                {cell
                    ? getSafariFriendlyDate(cell).format("DD.MM.YYYY HH:mm")
                    : "—"}
            </span>
        )
    },
    {
        Header: <span className="text-right flex-1">{t("price")}</span>,
        accessor: "price",
        width: "1fr",
        canSort: true,
        Cell: ({ cell, row }) => (
            <span className="text-right flex-1">
                {(cell?.value / 100)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "—"}
            </span>
        )
    },
    {
        accessor: "_id",
        width: 46,
        Cell: ({ row }) => <PoppedMoreIcon item={row} />
    }
];

export const getColumns = (t: TFunction): Column<Discounts>[] => [
    {
        Header: t("retailer.plural_0") as string,
        accessor: "retailer",
        width: "2.3fr",
        Cell: ({ cell, row }) => (
            <>
                <Avatar
                    key={row?._id}
                    size="xs"
                    Placeholder={WinePlaceholder}
                    alt={cell?.name}
                    photoUrl={cell?.logo?.url}
                    objectFit="contain"
                />

                <span className="ml-4 truncate">{cell?.name || "—"}</span>
            </>
        ),
        canSort: true
    },
    {
        Header: t("discounts.plural_0") as string,
        accessor: "name",
        id: "name",
        canSort: true,
        width: "2fr",
        Cell: ({ cell }) => cell || "—"
    },
    {
        Header: (
            <span className="text-right flex-1">
                {t("salepoints.plural_1")}
            </span>
        ),
        accessor: "retailerStoreIds",
        id: "salepoints",
        width: "1fr",
        Cell: ({ cell }) => (
            <span className="text-right flex-1">{cell?.length || "—"}</span>
        )
    },
    {
        Header: <span className="text-right flex-1">{t("createDate")}</span>,
        accessor: "createDate",
        canSort: true,
        width: "1fr",
        Cell: ({ cell }) => (
            <span className="text-right flex-1">
                {cell
                    ? getSafariFriendlyDate(cell).format("DD.MM.YYYY HH:mm")
                    : "—"}
            </span>
        )
    },
    {
        Header: <span className="text-right flex-1">{t("price")}</span>,
        accessor: "price",
        width: "1fr",
        canSort: true,
        Cell: ({ cell, row }) => (
            <span className="text-right flex-1">
                {(cell?.value / 100)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "—"}
            </span>
        )
    },
    {
        accessor: "_id",
        width: 46,
        Cell: ({ row }) => <PoppedMoreIcon item={row} />
    }
];
