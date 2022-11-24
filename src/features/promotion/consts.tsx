import { UseTranslationResponse } from "react-i18next";
import { Avatar } from "../../ui/atoms/Avatar";
import { WinePlaceholder } from "../../ui/atoms/illustration";
import { Column } from "../../ui/organisms/Table/types";
import { ListResponse, PromoInstrument, Role } from "../types";
import { PromosAPI } from "../utils/api/requests/promos-requests";
import { PoppedMoreIcon } from "./ui/molecules/PoppedMoreIcon";
import { PROMOTION_DELETE_MODAL } from "./ui/modals/DeleteModal";
import { REVIEW_DELETE_MODAL } from "../reviews/ui/modals/DeleteModal";
import { VIDEO_DELETE_MODAL } from "../videos/ui/modals/DeleteModal";
import { getSafariFriendlyDate } from "../catalogue/utils/getSafariFriendlyDate";
import { ARTICLE_DELETE_MODAL } from "../articles/ui/modals/DeleteModal";


interface PromoPart<DType extends object = Record<string, any>> {
    id: string;
    getList: (opt: any) => Promise<ListResponse<DType>>;
    sort: string;
    getColumns: (
        tr: UseTranslationResponse<"en">,
        role?: Role
    ) => Column<DType>[];
    itemUrl: string;
}

export const PROMOTION_PARTS: PromoPart[] = [
    {
        id: "promos-list",
        getList: PromosAPI.getList,
        sort: "-createDate",
        getColumns: ({ t, i18n }, role) => [
            {
                Header: t("label") as string,
                accessor: "product",
                id: "product.name",
                width: "2fr",
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
                        <span className="ml-4 truncate">{cell?.name}</span>
                    </>
                ),
                canSort: true
            },
            ...(role === "manufacturer"
                ? []
                : [
                      {
                          Header: t("manufacturer.plural_0") as string,
                          accessor: "product",
                          id: "product.manufacturer.name",
                          width: "1fr",
                          Cell: ({ cell }: any) => (
                              <span className="truncate">
                                  {cell?.manufacturer?.name ?? "—"}
                              </span>
                          ),
                          canSort: true
                      }
                  ]),
            {
                Header: t("createDate") as string,
                accessor: "createDate",
                canSort: true,
                width: "1fr",
                Cell: ({ cell }) =>
                    cell
                        ? getSafariFriendlyDate(cell).format("DD.MM.YYYY HH:mm")
                        : "—"
            },
            {
                Header: t("multiplyingBonusOn2") as string,
                accessor: "instruments",
                id: "multiplyingBonusOn2",
                width: 104,
                Cell: ({ cell }) =>
                    cell?.filter(
                        (instr: PromoInstrument) => instr.type === "bonusPoints"
                    ).length
                        ? t("yes")
                        : "-"
            },
            {
                Header: t("discount") as string,
                accessor: "instruments",
                id: "discount",
                width: 104,
                Cell: ({ cell }) =>
                    cell?.filter(
                        (instr: PromoInstrument) => instr.type === "discount"
                    ).length
                        ? t("yes")
                        : "-"
            },
            {
                Header: t("expertReview") as string,
                accessor: "instruments",
                id: "expertReview",
                width: 144,
                Cell: ({ cell }) =>
                    cell?.filter(
                        (instr: PromoInstrument) =>
                            instr.type === "expertReview"
                    ).length
                        ? t("yes")
                        : "-"
            },
            {
                Header: t("expertVideo") as string,
                accessor: "instruments",
                id: "expertVideo",
                width: 144,
                Cell: ({ cell }) =>
                    cell?.filter(
                        (instr: PromoInstrument) => instr.type === "expertVideo"
                    ).length
                        ? t("yes")
                        : "-"
            },
            {
                accessor: "_id",
                width: 46,
                Cell: ({ cell }) => (
                    <PoppedMoreIcon
                        id={cell}
                        url="promotion"
                        modal={PROMOTION_DELETE_MODAL}
                    />
                )
            }
        ],
        itemUrl: "promotion"
    },
    {
        id: "videos-list",
        getList: PromosAPI.getVideos,
        sort: "-createDate",
        getColumns: ({ t, i18n }) => [
            {
                Header: t("label") as string,
                accessor: "product",
                id: "product.name",
                width: "3fr",
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

                        <span className="ml-4 truncate">{cell?.name}</span>
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
                    <span className="truncate">
                        {cell?.manufacturer?.name ?? "—"}
                    </span>
                ),
                canSort: true
            },
            {
                Header: t("createDate") as string,
                accessor: "createDate",
                canSort: true,
                width: 145,
                Cell: ({ cell }) =>
                    cell
                        ? getSafariFriendlyDate(cell).format("DD.MM.YYYY HH:mm")
                        : "—"
            },
            {
                accessor: "_id",
                width: 46,
                Cell: ({ cell }) => (
                    <PoppedMoreIcon
                        id={cell}
                        url="video"
                        modal={VIDEO_DELETE_MODAL}
                    />
                )
            }
        ],
        itemUrl: "video"
    },
    {
        id: "reviews-list",
        getList: PromosAPI.getReviews,
        sort: "-createDate",
        getColumns: ({ t, i18n }) => [
            {
                Header: t("label") as string,
                accessor: "product",
                id: "product.name",
                width: "3fr",
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

                        <span className="ml-4 truncate">{cell?.name}</span>
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
                    <span className="truncate">
                        {cell?.manufacturer?.name ?? "—"}
                    </span>
                ),
                canSort: true
            },
            {
                Header: t("createDate") as string,
                accessor: "createDate",
                canSort: true,
                width: 145,
                Cell: ({ cell }) =>
                    cell
                        ? getSafariFriendlyDate(cell).format("DD.MM.YYYY HH:mm")
                        : "—"
            },
            {
                accessor: "_id",
                width: 46,
                Cell: ({ cell }) => (
                    <PoppedMoreIcon
                        id={cell}
                        url="reviews"
                        modal={REVIEW_DELETE_MODAL}
                    />
                )
            }
        ],
        itemUrl: "reviews"
    },
    {
        id: "articles-list",
        getList: PromosAPI.getArticleList,
        sort: "-createDate",
        getColumns: ({ t, i18n }) => [
            {
                Header: t("manufacturer.plural_0") as string,
                accessor: "manufacturer",
                id: "manufacturer",
                width: "2fr",
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
                    <span className="ml-4 truncate">
                        {cell?.name ?? "—"}
                    </span>
                    </>
                ),
                canSort: true
            },
            {
                Header: t("country") as string,
                accessor: "manufacturer",
                id: "manufacturer.country",
                width: "2fr",
                Cell: ({ cell }) => (
                    <span className="truncate">{cell?.country?.name}</span>
                ),
                canSort: true
            },
            {
                Header: t("createDate") as string,
                accessor: "createDate",
                canSort: true,
                width: 145,
                Cell: ({ cell }) =>
                    cell ? getSafariFriendlyDate(cell).format("DD.MM.YYYY HH:mm") : "—"
            },
            {
                accessor: "_id",
                width: 46,
                Cell: ({ cell }) => (
                    <PoppedMoreIcon
                        id={cell}
                        url="article"
                        modal={ARTICLE_DELETE_MODAL}
                    />
                )
            }
        ],
        itemUrl: "article"
    }
];
