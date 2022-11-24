import { TFunction } from "i18next";
import { Column } from "../../ui/organisms/Table/types";
import { getSafariFriendlyDate } from "../catalogue/utils/getSafariFriendlyDate";
import { Languages, Order } from "../types";
import { PoppedMoreIcon } from "./ui/molecules/PoppedMoreIcon";

export const getColumns = (
    t: TFunction,
    lang: Languages,
    activeTab: number,
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
        Header: t("orders.sendDate") as string,
        accessor: "sentDate",
        canSort: true,
        width: "1fr",
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
        width: "1fr",
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
        width: "1fr",
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
        Header: t("orders.deliveryCountry") as string,
        accessor: "deliveryAddress",
        id: "deliveryAddress.country",
        width: "1fr",
        Cell: ({ cell }) => <span className="truncate">{cell?.country?.name ?? "—"}</span>
    },
    {
        accessor: "_id",
        width: 46,
        Cell: ({ row }) => <PoppedMoreIcon item={row} activeTab={activeTab} />
    }
];
