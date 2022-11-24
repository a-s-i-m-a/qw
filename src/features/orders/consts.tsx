import { TFunction } from "i18next";
import { Price } from "../../ui/atoms/Price";
import { Column } from "../../ui/organisms/Table/types";
import { getSafariFriendlyDate } from "../catalogue/utils/getSafariFriendlyDate";
import { Languages, Order, Role } from "../types";
import { PoppedMoreIcon } from "./ui/molecules/PoppedMoreIcon";

export const getColumns = (
    t: TFunction,
    lang: Languages,
    activeTab: number,
    role?: Role
): Column<Order<false>>[] => [
    {
        Header: t("orders.orderNumber") as string,
        accessor: "number",
        id: "number",
        width: "1fr",
        Cell: ({ cell }) => cell ?? "—"
    },
    {
        Header: t("createDate") as string,
        accessor: "createDate",
        canSort: true,
        width: "1.4fr",
        Cell: ({ cell }) => (
            <span>
                {cell
                    ? getSafariFriendlyDate(cell).format("DD.MM.YYYY HH:mm")
                    : "—"}
            </span>
        )
    },
    {
        Header: t("orders.sendDate") as string,
        accessor: "sentDate",
        canSort: true,
        width: "1.4fr",
        Cell: ({ cell }) => (
            <span>
                {cell
                    ? getSafariFriendlyDate(cell).format("DD.MM.YYYY HH:mm")
                    : "—"}
            </span>
        ),
        isVisible: activeTab === 2
    },
    {
        Header: t("orders.deliveryDate") as string,
        accessor: "completeDate",
        canSort: true,
        width: "1.4fr",
        Cell: ({ cell }) => (
            <span>
                {cell
                    ? getSafariFriendlyDate(cell).format("DD.MM.YYYY HH:mm")
                    : "—"}
            </span>
        ),
        isVisible: activeTab === 3
    },
    {
        Header: t("orders.cancelDate") as string,
        accessor: "cancelDate",
        canSort: true,
        width: "1.4fr",
        Cell: ({ cell }) => (
            <span>
                {cell
                    ? getSafariFriendlyDate(cell).format("DD.MM.YYYY HH:mm")
                    : "—"}
            </span>
        ),
        isVisible: activeTab === 4
    },
    {
        Header: t("manufacturer.plural_0") as string,
        accessor: "manufacturer",
        width: "1.9fr",
        canSort: true,
        isVisible: role !== "manufacturer",
        Cell: ({ cell }) => (
            <span className="truncate">{cell?.name ?? "—"}</span>
        )
    },
    {
        Header: t("orders.deliveryCountry") as string,
        accessor: "deliveryAddress",
        id: "deliveryAddress.country",
        width:
            role !== "manufacturer"
                ? activeTab === 3 || activeTab === 2
                    ? "1.4fr"
                    : "1.9fr"
                : "3fr",
        Cell: ({ cell }) => (
            <span className="truncate">{cell?.country?.name ?? "—"}</span>
        )
    },
    {
        Header: (
            <span className="text-right flex-1">{t("orders.quantity")}</span>
        ),
        accessor: "items",
        id: "items",
        width: "1fr",
        Cell: ({ cell }) => (
            <span className="text-right flex-1">{cell?.length ?? "—"}</span>
        )
    },
    {
        Header: <span className="text-right flex-1">{t("orders.total")}</span>,
        accessor: "total",
        width: "1fr",
        Cell: ({ cell, row }) => (
            <Price
                newPrice={row.newPrice}
                price={cell}
                isAvailableForSale={true}
            />
        )
    },
    {
        accessor: "_id",
        width: 46,
        Cell: ({ row }) => <PoppedMoreIcon item={row} activeTab={activeTab} />
    }
];

export const CANADA_PROVINCES = [
    "AB",
    "BC",
    "MB",
    "NB",
    "NL",
    "NS",
    "NT",
    "NU",
    "ON",
    "PE",
    "QC",
    "SK",
    "YT"
];

export const US_STATES = [
    "AK",
    "AL",
    "AR",
    "AS",
    "AZ",
    "CA",
    "CO",
    "CT",
    "DC",
    "DE",
    "FL",
    "GA",
    "GU",
    "HI",
    "IA",
    "ID",
    "IL",
    "IN",
    "KS",
    "KY",
    "LA",
    "MA",
    "MD",
    "ME",
    "MI",
    "MN",
    "MO",
    "MP",
    "MS",
    "MT",
    "NC",
    "ND",
    "NE",
    "NH",
    "NJ",
    "NM",
    "NV",
    "NY",
    "OH",
    "OK",
    "OR",
    "PA",
    "PR",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UM",
    "UT",
    "VA",
    "VI",
    "VT",
    "WA",
    "WI",
    "WV",
    "WY"
];
