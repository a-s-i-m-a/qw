import reduceFields, { reduceList } from "../utils/reduceList";

const fields = [
    "name",
    { photo: ["url"] },
    {
        manufacturer: [
            "name",
            {
                country: ["name"]
            }
        ]
    },
    { region: ["name", { country: ["name"] }] },
    { price: ["value", "currency"] },
    { newPrice: ["value", "currency"] },
    "qvinoRating",
    "isAvailableForSale",
    "isPromoted",
    "stockCount",
    "sold",
    "bonusPoints",
    "isSoldByQvino"
];
const detailsFields = [
    "name",
    { photo: ["url"] },
    {
        manufacturer: ["name"]
    },
    {
        region: [
            "name",
            {
                country: ["name"]
            }
        ]
    },
    { price: ["value", "currency"] },
    { newPrice: ["value", "currency"] },
    "qvinoRating",
    "wineType",
    "vintage",
    "alcoholLevel",
    "volume",
    "description",
    {
        grapeSorts: ["name"]
    },
    "gastronomies",
    "bonusPoints",
    "videoUrl",
    "awardYear",
    { wineStyle: ["name"] },
    "agencyRatings",
    "isDeleted",
    "isAvailableForSale",
    "stockCount",
    "saleStatus",
    "videoId",
    "expertReviewId",
    { expertReview: [{ user: ["name"] }, "createDate"] },
    { video: [{ expert: ["name"] }, "createDate"] },
    "hasDoubleBonusPoints",
    "discountEndDate",
    "isPromoted",
    "agingPotential",
    "recommendedYear",
    "altitude",
    "taste",
    "isSoldByQvino"
];

export const productFields = reduceList(fields);
export const productDetailsFields = reduceList(detailsFields);

export const productListFields = reduceFields({
    items: fields
});
