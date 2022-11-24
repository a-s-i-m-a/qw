import reduceFields, { reduceList } from "../utils/reduceList";

const stats = [
    "sellsTotal",
    "commissionTotal",
    "completedOrderCount",
    "cancelledOrderCount",
    {
        timeline: [
            "date",
            "sellsTotal",
            "commissionTotal",
            "completedOrderCount",
            "cancelledOrderCount",
            "cancelledSellsTotal"
        ]
    },
    { sellsByCountry: ["name", "percent", "count", "total"] }
];

export const statsFields = reduceList(stats);

const pieFields = ["name", "percent", "count", "total"];

export const statsListFields = reduceFields({
    items: pieFields
});
