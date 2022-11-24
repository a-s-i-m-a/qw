import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import { Search } from "../../../../ui/atoms/Search";
import { Table } from "../../../../ui/organisms/Table";
import { Column } from "../../../../ui/organisms/Table/types";
import { useTableFetch } from "../../../../ui/organisms/Table/useTableFetch";
import { authStore } from "../../../auth/store/AuthStore";
import { Salepoint } from "../../../types";
import { SalepointsAPI } from "../../../utils/api/requests/salepoints-requests";
import { discountsStore } from "../../store/DiscountsStore";
import { FormCheckbox } from "../atoms/FormCheckbox";

export const SalepointsList = () => {
    const [search, setSearch] = useState("");
    const { isEditing, discount } = useContext(discountsStore);
    const { user } = useContext(authStore);
    const extraArgs = useMemo(
        () => ({
            q: search,
            role: "retailer",
            retailerId: user?.retailer?._id
        }),
        [search, user]
    );
    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            setSearch(event.target.value);
        },
        [setSearch]
    );
    const columns: Column<Salepoint>[] = useMemo(
        () => [
            {
                accessor: "_id",
                width: 46,
                Cell: ({ row }) => (
                    <FormCheckbox
                        name={`retailerStoreIds.${row._id}`}
                        isEditing={isEditing}
                        value={row._id}
                    />
                )
            },
            {
                accessor: "location",
                id: "location.city",
                width: "1fr",
                Cell: ({ cell }) => (
                    <span className="truncate">{cell?.city}</span>
                )
            },
            {
                accessor: "location",
                id: "location.address",
                width: "3fr",
                Cell: ({ cell }) => (
                    <span className="truncate">{cell?.address}</span>
                )
            }
        ],
        [isEditing]
    );
    const fetchFn = useCallback(
        async args => {
            const data = await SalepointsAPI.getList({
                ...args,
                ...extraArgs
            });
            return data;
        },
        [extraArgs]
    );
    const { data, isLoading, pageCount, fetch } = useTableFetch<Salepoint>({
        id: "salepoints",
        fetchFn
    });

    useEffect(() => {
        user?.role !== "retailer" && fetch({ pageIndex: 0 });
    }, [user, fetch]);

    const filtered = data.filter(item =>
        discount?.retailerStoreIds.includes(item._id)
    );

    return (
        <section className="flex flex-col flex-1 overflow-y-auto">
            <Search
                className="w-300p"
                value={search}
                onChange={handleSearchChange}
            />
            {user?.role === "retailer" ? (
                <Table
                    data={data}
                    isLoading={isLoading}
                    pageCount={pageCount}
                    fetch={fetch}
                    columns={columns}
                    className="mt-40p"
                    sortedColumn={"name"}
                    withoutHeader={true}
                    id="salepoints"
                />
            ) : (
                <section className="mt-18p">
                    {filtered.map(item => (
                        <span
                            key={item._id}
                            className="flex flex-row py-18p px-10p text-14"
                        >
                            <p className="w-230p">{item.location.city}</p>
                            <p>{item.location.address}</p>
                        </span>
                    ))}
                </section>
            )}
        </section>
    );
};
